export type Config = {
  separationFactor: number;
  alignmentFactor: number;
  cohesionFactor: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionRadius: number;
  numBoids: number;
  boxSize: number;
};

export const config: Config = {
  separationFactor: 0.005,
  alignmentFactor: 0.002,
  cohesionFactor: 0.003,
  separationRadius: 0.1,
  alignmentRadius: 0.2,
  cohesionRadius: 0.2,
  numBoids: 300,
  boxSize: 3,
};