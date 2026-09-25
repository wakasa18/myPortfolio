import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { createFrameLoop } from "@/app/lib/frame-loop";
import { clampProgress, getCameraPosition, getHorizonQuality } from "./horizon-model";

/** GPU scene adapted from the supplied Horizon component. */
export function createHorizonScene(canvas: HTMLCanvasElement, viewport: HTMLElement, root: HTMLElement) {
  const compact = window.matchMedia("(pointer: coarse)").matches;
  const quality = getHorizonQuality(viewport.clientWidth, viewport.clientHeight, window.devicePixelRatio || 1, compact, navigator.hardwareConcurrency || 4);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "low-power" });
  } catch { return null; }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050611, 0.0004);
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2400);
  camera.position.set(0, 30, 300);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.55;
  renderer.setClearColor(0x050611, 0);
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const stars: THREE.ShaderMaterial[] = [];
  const mountains: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>[] = [];
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;

  for (let layer = 0; layer < quality.starLayers; layer++) {
    const count = quality.starCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const radius = 200 + Math.random() * 850;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions.set([radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi) - 450], i * 3);
      const choice = Math.random();
      color.setHSL(choice < 0.7 ? 0 : choice < 0.9 ? 0.08 : 0.6, choice < 0.7 ? 0 : 0.5, 0.75 + Math.random() * 0.25);
      colors.set([color.r, color.g, color.b], i * 3);
      sizes[i] = 0.8 + Math.random() * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, depth: { value: layer } },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float depth;
        void main() {
          vColor = color;
          vec3 pos = position;
          float angle = time * 0.012 * (1.0 - depth * 0.3);
          pos.xy = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * pos.xy;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = clamp(size * 350.0 / max(1.0, -mvPosition.z), 1.0, 5.0);
          gl_Position = projectionMatrix * mvPosition;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.0, 0.5, distance));
        }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    geometries.push(geometry); materials.push(material); stars.push(material);
    scene.add(new THREE.Points(geometry, material));
  }

  const nebulaGeometry = new THREE.PlaneGeometry(3500, 1900, compact ? 24 : 48, 24);
  const nebulaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }, color1: { value: new THREE.Color(0x244ac7) },
      color2: { value: new THREE.Color(0x6655a4) }, opacity: { value: 0.18 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float time;
      void main() {
        vUv = uv;
        vec3 pos = position;
        vElevation = sin(pos.x * 0.007 + time) * cos(pos.y * 0.007 + time) * 20.0;
        pos.z += vElevation;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float opacity;
      uniform float time;
      varying vec2 vUv;
      varying float vElevation;
      void main() {
        float wave = sin(vUv.x * 9.0 + time) * cos(vUv.y * 7.0 + time);
        vec3 color = mix(color1, color2, wave * 0.5 + 0.5);
        float alpha = opacity * max(0.0, 1.0 - length(vUv - 0.5) * 1.8);
        gl_FragColor = vec4(color, alpha * (1.0 + vElevation * 0.01));
      }`,
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
  });
  const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
  nebula.position.set(0, 160, -1250);
  geometries.push(nebulaGeometry); materials.push(nebulaMaterial); scene.add(nebula);

  const layers = [
    { z: -50, height: 60, color: 0x111325, opacity: 1 },
    { z: -130, height: 80, color: 0x17233e, opacity: 0.9 },
    { z: -230, height: 100, color: 0x173956, opacity: 0.75 },
    { z: -350, height: 120, color: 0x1d4c64, opacity: 0.6 },
  ];
  layers.forEach((layer, index) => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 60; i++) {
      const x = (i / 60 - 0.5) * 2400;
      const y = Math.sin(i * 0.33 + index) * layer.height + Math.sin(i * 0.17) * layer.height * 0.4 + Math.random() * 12 - 140;
      points.push(new THREE.Vector2(x, y));
    }
    points.push(new THREE.Vector2(1200, -1200), new THREE.Vector2(-1200, -1200));
    const geometry = new THREE.ShapeGeometry(new THREE.Shape(points));
    const material = new THREE.MeshBasicMaterial({ color: layer.color, transparent: true, opacity: layer.opacity, side: THREE.DoubleSide, depthWrite: false });
    const mountain = new THREE.Mesh(geometry, material);
    mountain.position.z = layer.z;
    mountain.renderOrder = 4 - index;
    mountain.userData = { baseZ: layer.z, baseOpacity: layer.opacity };
    mountains.push(mountain); geometries.push(geometry); materials.push(material); scene.add(mountain);
  });

  const atmosphereGeometry = new THREE.SphereGeometry(1700, 24, 16);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `varying vec3 vNormal; void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    fragmentShader: `varying vec3 vNormal; uniform float time; void main() {
      float intensity = pow(max(0.0, 0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      vec3 color = vec3(0.08, 0.14, 0.32) * intensity * (sin(time * 0.4) * 0.05 + 0.9);
      gl_FragColor = vec4(color, intensity * 0.08);
    }`,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  });
  geometries.push(atmosphereGeometry); materials.push(atmosphereMaterial);
  scene.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));

  if (quality.bloom && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.4, 0.85);
    composer.addPass(bloom);
  }

  let progress = 0, currentProgress = 0, time = 0;
  let visible = false, motionEnabled = true, contextLost = false;
  let averageFrame = 16, slowFrames = 0, qualityReduced = false;
  const target = new THREE.Vector3();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const loop = createFrameLoop(deltaMs => {
    if (contextLost) return;
    const delta = deltaMs / 1000;
    time += delta;
    currentProgress += (progress - currentProgress) * (1 - Math.exp(-delta * 7));
    const nextCamera = getCameraPosition(currentProgress);
    camera.position.set(nextCamera.x + Math.sin(time * 0.1) * 2, nextCamera.y + Math.cos(time * 0.15), nextCamera.z);
    target.set(0, 10, camera.position.z - 900);
    camera.lookAt(target);
    stars.forEach(material => { material.uniforms.time.value = time; });
    nebulaMaterial.uniforms.time.value = time * 0.18;
    atmosphereMaterial.uniforms.time.value = time;
    mountains.forEach((mountain, i) => {
      mountain.position.x = Math.sin(time * 0.1) * (2 + i);
      mountain.position.y = Math.cos(time * 0.15) * (1 + i * 0.4) - currentProgress * (45 + i * 18);
      mountain.material.opacity = mountain.userData.baseOpacity * (1 - THREE.MathUtils.smoothstep(currentProgress, 0.4, 0.72));
      mountain.visible = mountain.material.opacity > 0.01;
    });
    if (composer) composer.render(delta); else renderer.render(scene, camera);
    if (deltaMs > 0 && !qualityReduced) {
      averageFrame += (deltaMs - averageFrame) * 0.05;
      slowFrames = averageFrame > 28 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 75) {
        qualityReduced = true;
        composer?.passes.forEach(pass => pass.dispose());
        composer?.dispose(); composer = null; bloom = null;
        resize();
      }
    }
  });

  function sync() {
    const canDraw = visible && !document.hidden && !contextLost;
    loop.setRunning(canDraw && motionEnabled && !reduced.matches);
    if (canDraw) loop.requestDraw();
  }
  function resize() {
    const width = Math.max(1, viewport.clientWidth), height = Math.max(1, viewport.clientHeight);
    const options = getHorizonQuality(width, height, window.devicePixelRatio || 1, compact, navigator.hardwareConcurrency || 4);
    const ratio = options.pixelRatio * (qualityReduced ? 0.75 : 1);
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    composer?.setPixelRatio(ratio * 0.85);
    composer?.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    sync();
  }
  function onContextLost(event: Event) {
    event.preventDefault(); contextLost = true; loop.setRunning(false); root.dataset.scene = "fallback";
  }
  function onContextRestored() { contextLost = false; root.dataset.scene = "ready"; resize(); }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewport);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(root);
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", sync);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  root.dataset.scene = "ready";
  resize();

  return {
    setProgress(value: number) { progress = clampProgress(value); },
    setMotionEnabled(value: boolean) { motionEnabled = value; sync(); },
    dispose() {
      loop.dispose(); resizeObserver.disconnect(); observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      composer?.passes.forEach(pass => pass.dispose());
      composer?.dispose(); renderer.dispose(); scene.clear();
      root.dataset.scene = "fallback";
    },
  };
}
