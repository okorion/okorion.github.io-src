export const SceneLoadingState = () => {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      role="status"
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-start p-4 sm:p-6"
    >
      <div className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/70 shadow-[0_12px_36px_rgba(0,0,0,0.24)] backdrop-blur-md">
        LOADING SCENE
      </div>
    </div>
  );
};
