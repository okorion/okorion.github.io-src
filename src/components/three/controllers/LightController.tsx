export const LightController = () => {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} castShadow />
    </>
  );
};
