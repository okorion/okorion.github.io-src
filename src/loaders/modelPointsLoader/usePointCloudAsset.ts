import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { FileLoader } from "three";
import { parsePointCloud } from "./pointCloudFormat";

export function usePointCloudAsset(path: string) {
  const loaded = useLoader(FileLoader, path, (loader) => {
    loader.setResponseType("arraybuffer");
  });
  const asset = useMemo(() => {
    if (!(loaded instanceof ArrayBuffer)) {
      throw new Error(`Point cloud response was not binary: ${path}`);
    }
    return parsePointCloud(loaded);
  }, [loaded, path]);

  useEffect(() => {
    return () => asset.geometry.dispose();
  }, [asset]);

  return asset;
}
