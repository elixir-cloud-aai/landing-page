'use client';

import { ComponentProps, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export type { GlobeMarker } from './3d-globe';

const placeholder = (
  <div className="flex h-[500px] w-full items-center justify-center">
    <div className="h-64 w-64 animate-pulse rounded-full bg-muted" />
  </div>
);

// three.js is the heaviest dependency on the site. Load it in its own chunk,
// on the client only, so it doesn't block first paint.
const Globe3D = dynamic(() => import('./3d-globe'), {
  ssr: false,
  loading: () => placeholder,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// Without WebGL (disabled GPU, some older devices) three.js throws, so show a
// static fallback instead of a broken canvas.
export default function LazyGlobe3D(props: ComponentProps<typeof Globe3D>) {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => setWebgl(supportsWebGL()), []);

  if (webgl === null) return placeholder;
  if (!webgl) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-gradient-to-br from-elixirblue/30 via-elixirgreen/20 to-transparent" />
      </div>
    );
  }
  return <Globe3D {...props} />;
}
