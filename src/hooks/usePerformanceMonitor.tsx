import { useEffect, useRef } from "react";

export const usePerformanceMonitor = (enabled: boolean = false) => {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsRef = useRef(0);
  const frameTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let animationId: number;
    
    const measure = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      
      frameCount.current++;
      
      // Update metrics every 60 frames
      if (frameCount.current % 60 === 0) {
        fpsRef.current = Math.round(1000 / (delta / 60));
        frameTimeRef.current = Math.round(delta / 60 * 100) / 100;
        
        // Only log in development (checking window.location for dev environment)
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          console.log(`Performance: ${fpsRef.current} FPS, ${frameTimeRef.current}ms frame time`);
        }
        
        lastTime.current = now;
      }
      
      animationId = requestAnimationFrame(measure);
    };
    
    measure();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled]);

  return {
    fps: fpsRef.current,
    frameTime: frameTimeRef.current,
    memory: (performance as any).memory?.usedJSHeapSize || 0
  };
};

export const PerformanceDisplay = ({ enabled = false }: { enabled?: boolean }) => {
  const { fps, frameTime, memory } = usePerformanceMonitor(enabled);
  
  // Only show in development environment
  if (!enabled || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')) {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <div>FPS: {fps}</div>
      <div>Frame: {frameTime}ms</div>
      {memory > 0 && <div>Memory: {Math.round(memory / 1024 / 1024)}MB</div>}
    </div>
  );
};