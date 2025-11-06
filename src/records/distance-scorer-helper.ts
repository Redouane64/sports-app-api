import DTW from 'dynamic-time-warping-ts';

// lon,lat,elev pairs
export type Point3D = [number, number, number];

export default function calculateDistance(
  a: Array<Point3D>,
  b: Array<Point3D>,
) {
  const distanceFn = function (a: Point3D, b: Point3D): number {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const dtw = new DTW<[number, number, number]>(a, b, distanceFn);
  return dtw.getDistance();
}
