export const expForLevel = (level) =>
  Math.floor(1000 * Math.pow(1.15, level - 1));

export function applyExp(level, exp, gained) {
  let totalExp = exp + gained;
  let currentLevel = level;

  while (totalExp >= expForLevel(currentLevel)) {
    totalExp -= expForLevel(currentLevel);
    currentLevel++;
  }

  return { level: currentLevel, exp: totalExp };
}
