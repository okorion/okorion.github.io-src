import * as THREE from "three";
import { PARTICLE_CONSTANTS } from "./constants";

export interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  startTime: number;
  initialSize: number;
  initialColor?: THREE.Color;
}

/**
 * Update particle positions, sizes and filter out expired particles
 * @param particlesData - Array of particle data
 * @param positions - Float32Array for particle positions
 * @param sizes - Float32Array for particle sizes
 * @param pointSize - Base point size
 * @param lifetime - Particle lifetime in seconds
 * @param delta - Time delta for this frame
 * @param currentTime - Current elapsed time
 * @returns Filtered array of active particles
 */
export const updateParticles = (
  particlesData: ParticleData[],
  positions: Float32Array,
  sizes: Float32Array,
  pointSize: number,
  lifetime: number,
  delta: number,
  currentTime: number,
): ParticleData[] => {
  return particlesData.filter((particle, index) => {
    const elapsed = currentTime - particle.startTime;
    if (elapsed > lifetime) return false;

    // Update position
    particle.position.addScaledVector(particle.velocity, delta);
    const ix = index * 3;
    positions[ix] = particle.position.x;
    positions[ix + 1] = particle.position.y;
    positions[ix + 2] = particle.position.z;

    // Update size with quadratic falloff
    const sizeRatio = 1 - elapsed / lifetime;
    const size = particle.initialSize * sizeRatio * sizeRatio;
    sizes[index] =
      size < pointSize * PARTICLE_CONSTANTS.MIN_SIZE_THRESHOLD ? 0 : size;

    // Apply velocity damping
    particle.velocity.multiplyScalar(PARTICLE_CONSTANTS.VELOCITY_DAMPING);

    return true;
  });
};

/**
 * Create a random velocity vector with specified spread
 * @param spread - Randomness spread factor
 * @returns Random THREE.Vector3
 */
export const createRandomVelocity = (spread: number): THREE.Vector3 => {
  return new THREE.Vector3(
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
    (Math.random() - 0.5) * spread,
  );
};

/**
 * Calculate camera-relative origin position for particle spawning
 * @param camera - THREE.Camera instance
 * @param direction - Direction vector
 * @param distanceMultiplier - Distance multiplier from camera
 * @returns THREE.Vector3 position
 */
export const calculateParticleOrigin = (
  camera: THREE.Camera,
  direction: THREE.Vector3,
  distanceMultiplier = PARTICLE_CONSTANTS.ORIGIN_DISTANCE_MULTIPLIER,
): THREE.Vector3 => {
  return camera.position
    .clone()
    .add(direction.clone().multiplyScalar(distanceMultiplier));
};
