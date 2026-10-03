import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useObservatory } from '../../app/context';
import { RENDER_QUALITY } from '../../config/rendering';
import { MATERIAL_MAP_URLS } from './assets';
import { MaterialContext } from './context';
import { createMaterialResources } from './resources';

interface MaterialLibraryProps {
  children: ReactNode;
}

export function MaterialLibrary({ children }: MaterialLibraryProps) {
  const { settings } = useObservatory();
  const originals = useLoader(TextureLoader, MATERIAL_MAP_URLS);
  const { gl } = useThree();
  const resources = useMemo(
    () => createMaterialResources(originals, gl.capabilities.getMaxAnisotropy()),
    [originals, gl],
  );
  useEffect(() => {
    resources.quality.value = RENDER_QUALITY[settings.quality].materialProjection;
  }, [resources, settings.quality]);
  useEffect(() => () => resources.dispose(), [resources]);
  return (
    <MaterialContext.Provider value={resources.materials}>{children}</MaterialContext.Provider>
  );
}
