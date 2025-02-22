import * as cg from './types';

export const mapToWhite: Record<cg.Orientation, cg.TransformToWhite> = {
  white: (pos: cg.Pos, _: cg.BoardDimensions) => pos,
  black: (pos: cg.Pos, bt: cg.BoardDimensions) => [bt.width + 1 - pos[0], bt.height + 1 - pos[1]],
  right: (pos: cg.Pos, bt: cg.BoardDimensions) => [bt.height + 1 - pos[1], pos[0]],
  left: (pos: cg.Pos, bt: cg.BoardDimensions) => [pos[1], bt.width + 1 - pos[0]],
};

export const mapToWhiteInverse: Record<cg.Orientation, cg.TransformToWhite> = {
  white: (pos: cg.Pos, _: cg.BoardDimensions) => pos,
  black: (pos: cg.Pos, bt: cg.BoardDimensions) => [bt.width + 1 - pos[0], bt.height + 1 - pos[1]],
  right: (pos: cg.Pos, bt: cg.BoardDimensions) => [pos[1], bt.width + 1 - pos[0]],
  left: (pos: cg.Pos, bt: cg.BoardDimensions) => [bt.width + 1 - pos[0], pos[1]],
};

export const translateBase: Record<cg.Orientation, cg.TranslateBase> = {
  white: (pos: cg.Pos, xScale: number, yScale: number, bt: cg.BoardDimensions) => [
    (pos[0] - 1) * xScale,
    (bt.height - pos[1]) * yScale,
  ],
  black: (pos: cg.Pos, xScale: number, yScale: number, bt: cg.BoardDimensions) => [
    (bt.width - pos[0]) * xScale,
    (pos[1] - 1) * yScale,
  ],
  right: (pos: cg.Pos, xScale: number, yScale: number, _) => [(pos[1] - 1) * xScale, (pos[0] - 1) * yScale],
  left: (pos: cg.Pos, xScale: number, yScale: number, bt: cg.BoardDimensions) => [
    (bt.width - pos[0]) * xScale,
    (pos[1] - 1) * yScale,
  ],
};
