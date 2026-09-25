type Vec3 = [number, number, number];

function normalize([x, y, z]: Vec3): Vec3 {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function center(t: number): Vec3 {
  const radius = 2 + 0.66 * Math.cos(3 * t);
  return [radius * Math.cos(2 * t), radius * Math.sin(2 * t), 0.8 * Math.sin(3 * t)];
}

/** Static geometry: positions and smooth normals are uploaded only once. */
export function createKnotMesh(rings = 128, sides = 16) {
  const vertices = new Float32Array(rings * sides * 6);
  const indices = new Uint16Array(rings * sides * 6);
  for (let i = 0; i < rings; i++) {
    const t = i / rings * Math.PI * 2;
    const c = center(t);
    const next = center(t + 0.001);
    const tangent = normalize([next[0] - c[0], next[1] - c[1], next[2] - c[2]]);
    const binormal = normalize(cross(tangent, normalize([c[0], c[1], 0])));
    const normal = normalize(cross(binormal, tangent));
    for (let j = 0; j < sides; j++) {
      const angle = j / sides * Math.PI * 2;
      const offset = (i * sides + j) * 6;
      for (let k = 0; k < 3; k++) {
        const n = normal[k] * Math.cos(angle) + binormal[k] * Math.sin(angle);
        vertices[offset + k] = c[k] + n * 0.43;
        vertices[offset + 3 + k] = n;
      }
      const a = i * sides + j;
      const b = ((i + 1) % rings) * sides + j;
      const cIndex = ((i + 1) % rings) * sides + (j + 1) % sides;
      const d = i * sides + (j + 1) % sides;
      indices.set([a, b, cIndex, a, cIndex, d], offset);
    }
  }
  return { vertices, indices };
}

const vertexSource = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  uniform vec3 uAngles;
  uniform vec2 uScale;
  varying vec3 vNormal;

  vec3 rotate(vec3 p) {
    vec3 c = cos(uAngles), s = sin(uAngles);
    p.yz = mat2(c.x, s.x, -s.x, c.x) * p.yz;
    p.xz = mat2(c.y, -s.y, s.y, c.y) * p.xz;
    p.xy = mat2(c.z, s.z, -s.z, c.z) * p.xy;
    return p;
  }

  void main() {
    vec3 p = rotate(aPosition);
    float depth = 8.0 - p.z;
    // Homogeneous projection preserves perspective-correct normal interpolation.
    gl_Position = vec4(p.x * uScale.x * 8.0, -p.y * uScale.y * 8.0, -p.z, depth);
    vNormal = rotate(aNormal);
  }
`;

const fragmentSource = `
  precision mediump float;
  varying vec3 vNormal;

  void main() {
    vec3 n = normalize(vNormal);
    float light = max(0.0, dot(n, vec3(-0.38, -0.58, 0.72)));
    float specular = pow(max(0.0, dot(n, vec3(-0.18, -0.32, 0.93))), 28.0);
    float rim = pow(1.0 - abs(n.z), 3.0) * 0.118;
    float band = pow(max(0.0, cos(n.y * 5.0 + n.x * 2.0)), 12.0) * light * 0.176;
    vec3 color = vec3(0.169, 0.224, 0.376)
      + light * vec3(0.412, 0.424, 0.455)
      + specular * vec3(0.471, 0.451, 0.333) + rim + band;
    gl_FragColor = vec4(color, 1.0);
  }
`;

/** One GPU draw call per frame, with no mesh allocation or depth sorting. */
export function createSculptureRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: true, antialias: true, depth: true, stencil: false,
    powerPreference: "low-power", preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  const buffers: WebGLBuffer[] = [];
  const program = gl.createProgram();
  function destroy() {
    buffers.forEach(buffer => gl!.deleteBuffer(buffer));
    shaders.forEach(shader => gl!.deleteShader(shader));
    if (program) gl!.deleteProgram(program);
  }
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
    const shader = gl.createShader(type);
    if (!shader) { destroy(); return null; }
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { destroy(); return null; }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { destroy(); return null; }
  gl.useProgram(program);

  const { vertices, indices } = createKnotMesh();
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  if (vertexBuffer) buffers.push(vertexBuffer);
  if (indexBuffer) buffers.push(indexBuffer);
  if (!vertexBuffer || !indexBuffer) { destroy(); return null; }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  for (const [name, offset] of [["aPosition", 0], ["aNormal", 12]] as const) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 24, offset);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  const angles = gl.getUniformLocation(program, "uAngles");
  const scale = gl.getUniformLocation(program, "uScale");

  return {
    resize(width: number, height: number, pixelRatio: number) {
      const dpr = Math.min(pixelRatio, 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const size = Math.min(width, height);
      gl.uniform2f(scale, size * 0.316 / Math.max(width, 1), size * 0.316 / Math.max(height, 1));
    },
    render(x: number, y: number, z: number) {
      gl.uniform3f(angles, x, y, z);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    },
    destroy,
  };
}
