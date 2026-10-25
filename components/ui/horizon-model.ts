export const horizonSections = [
  { title: "SEAN", eyebrow: "SEAN VILLANUEVA / WEB DEVELOPER", note: "ABOUT SEAN", lines: ["Junior Web Developer", "Santa Maria, Bulacan, Philippines"] },
  { title: "CODE", eyebrow: "FRONT END & BACK END", note: "DEVELOPMENT", lines: ["PHP, CodeIgniter 4 & MySQL", "HTML, CSS, JavaScript & jQuery/AJAX"] },
  { title: "WORK", eyebrow: "ONGOING TEAM PROJECT / 2025–2026", note: "PHARXMACO", lines: ["Pharxmaco Drugstore", "Online point of sale & inventory system"] },
] as const;

const positions = [
  { x: 0, y: 30, z: 300 },
  { x: 0, y: 40, z: -50 },
  { x: 0, y: 50, z: -700 },
] as const;

export function clampProgress(progress: number) {
  return Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
}

export function getCameraPosition(progress: number) {
  const position = clampProgress(progress) * (positions.length - 1);
  const index = Math.min(Math.floor(position), positions.length - 2);
  const fraction = position - index;
  const from = positions[index], to = positions[index + 1];
  return {
    x: from.x + (to.x - from.x) * fraction,
    y: from.y + (to.y - from.y) * fraction,
    z: from.z + (to.z - from.z) * fraction,
  };
}

export function getHorizonSection(progress: number) {
  return Math.round(clampProgress(progress) * (horizonSections.length - 1));
}

export function getHorizonQuality(width: number, height: number, dpr: number, coarse: boolean, cores: number) {
  const compact = coarse || width < 768;
  return {
    starCount: compact ? 500 : 1000,
    starLayers: compact ? 2 : 3,
    pixelRatio: Math.max(0.25, Math.min(dpr, compact ? 1 : 1.25, 1600 / Math.max(1, width), 1000 / Math.max(1, height))),
    bloom: !compact && width >= 900 && cores >= 6,
  };
}
