import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { ParticleData } from "../three";

/**
 * Custom hook for managing mouse position relative to WebGL canvas
 * @param glDomElement - WebGL canvas element
 * @returns React ref containing normalized mouse coordinates (-1 to 1)
 */
export const useMousePosition = (glDomElement: HTMLElement) => {
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = glDomElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    glDomElement.addEventListener("mousemove", handleMouseMove);
    return () => glDomElement.removeEventListener("mousemove", handleMouseMove);
  }, [glDomElement]);

  return mouse;
};

/**
 * Custom hook for managing particle system state
 * @returns Object containing particle data ref and helper functions
 */
export const useParticleSystem = () => {
  const particlesData = useRef<ParticleData[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  const addParticle = (particle: ParticleData) => {
    particlesData.current.push(particle);
  };

  const clearParticles = () => {
    particlesData.current.length = 0;
  };

  const getParticleCount = () => particlesData.current.length;

  return {
    particlesData,
    particlesRef,
    geometryRef,
    addParticle,
    clearParticles,
    getParticleCount,
  };
};
