function pointsToString(points) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export { pointsToString };
