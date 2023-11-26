export type Config = {
  separationFactor: number;
  alignmentFactor: number;
  cohesionFactor: number;
  numBoids: number;
  boxSize: number;
};

export const config: Config = {
  separationFactor: 0.005,
  alignmentFactor: 0.002,
  cohesionFactor: 0.003,
  numBoids: 300,
  boxSize: 3,
};