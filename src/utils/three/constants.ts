// Animation and timing constants
export const ANIMATION_CONSTANTS = {
  /** Camera initial animation delay in seconds */
  ACTIVATION_DELAY: 2.0,
  /** Rotation speed for floor points per frame */
  FLOOR_ROTATION_SPEED: 0.0005,
  /** Y-axis movement randomness amplitude for floor points */
  FLOOR_Y_RANDOMNESS: 0.0002,
} as const;

// Particle system constants
export const PARTICLE_CONSTANTS = {
  /** Velocity damping factor applied each frame */
  VELOCITY_DAMPING: 0.98,
  /** Minimum size threshold for particle visibility (as ratio of initial size) */
  MIN_SIZE_THRESHOLD: 0.05,
  /** Random velocity spread factor */
  VELOCITY_SPREAD: 0.1,
  /** Reduced velocity spread for guide points */
  GUIDE_VELOCITY_SPREAD: 0.01,
  /** Distance multiplier from camera for particle origin */
  ORIGIN_DISTANCE_MULTIPLIER: 2,
} as const;

// Rendering constants
export const RENDERING_CONSTANTS = {
  /** Default bounding sphere radius for particle systems */
  BOUNDING_SPHERE_RADIUS: 25,
  /** Distance attenuation factor for point size calculation */
  DISTANCE_ATTENUATION_FACTOR: 300.0,
  /** Texture canvas default size */
  TEXTURE_SIZE: 64,
  /** Texture canvas margin */
  TEXTURE_MARGIN: 2,
} as const;

// Easing function constants
export const EASING_CONSTANTS = {
  /** Color transition easing power for guide points */
  COLOR_TRANSITION_POWER: 16,
} as const;
