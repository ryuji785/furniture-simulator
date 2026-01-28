import type { Room } from '../types';

export interface RoomDimensions {
  ldk: Room;
  westernRoom: Room;
}

export function calculateRoomDimensions(ldkTsubo: number, westernTsubo: number): RoomDimensions {
  const tsuboToM2 = (tsubo: number) => tsubo * 1.62;
  const m2ToCm2 = (m2: number) => m2 * 10000;

  const tsuboToWidth = (tsubo: number) => {
    const m2 = tsuboToM2(tsubo);
    const cm2 = m2ToCm2(m2);
    const ratio = 1.5;
    const widthCm = Math.sqrt(cm2 / ratio);
    return Math.round(widthCm / 10) * 10;
  };

  const tsuboToDepth = (tsubo: number, width: number) => {
    const m2 = tsuboToM2(tsubo);
    const cm2 = m2ToCm2(m2);
    const depthCm = cm2 / width;
    return Math.round(depthCm / 10) * 10;
  };

  const ldkWidth = tsuboToWidth(ldkTsubo);
  const ldkDepth = tsuboToDepth(ldkTsubo, ldkWidth);

  const westernWidth = tsuboToWidth(westernTsubo);
  const westernDepth = tsuboToDepth(westernTsubo, westernWidth);

  return {
    ldk: {
      id: 'ldk',
      name: 'LDK',
      roomType: 'living-room',
      tsubo: ldkTsubo,
      widthCm: ldkWidth,
      depthCm: ldkDepth,
      xCm: 0,
      yCm: 0,
    },
    westernRoom: {
      id: 'western',
      name: '洋室',
      roomType: 'bedroom',
      tsubo: westernTsubo,
      widthCm: westernWidth,
      depthCm: westernDepth,
      xCm: ldkWidth,
      yCm: 0,
    },
  };
}

export function calculateSingleRoomDimensions(tsubo: number): { widthCm: number; depthCm: number } {
  const tsuboToM2 = (t: number) => t * 1.62;
  const m2ToCm2 = (m2: number) => m2 * 10000;

  const m2 = tsuboToM2(tsubo);
  const cm2 = m2ToCm2(m2);
  const ratio = 1.5;
  const widthCm = Math.sqrt(cm2 / ratio);
  const width = Math.round(widthCm / 10) * 10;
  const depthCm = cm2 / width;
  const depth = Math.round(depthCm / 10) * 10;

  return { widthCm: width, depthCm: depth };
}
