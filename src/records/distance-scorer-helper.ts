import DTW from 'dynamic-time-warping-ts';
import { Position } from 'typeorm';

export default function calculateDistance(
  a: Array<Position>,
  b: Array<Position>,
) {
  const distanceFn = function (a: Position, b: Position): number {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const dtw = new DTW<Position>(a, b, distanceFn);
  return dtw.getDistance();
}
