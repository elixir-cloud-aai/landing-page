'use client';
import React, { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Globe base color (used as fallback or tint) */
  globeColor?: string;
  /** URL to the Earth texture map */
  textureUrl?: string;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness (higher = more diffuse, default 3) */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** Auto rotate speed (0 = disabled) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
  /** Initial rotation */
  initialRotation?: { x: number; y: number };
  /** Marker default size */
  markerSize?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: GlobeMarker) => void;
  /** Callback when a marker is hovered */
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  'https://unpkg.com/three-globe@2.31.0/example/img/earth-day.jpg';
const DEFAULT_BUMP_TEXTURE =
  'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker Component (static - rotation handled by parent group)
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({
  marker,
  radius,
  defaultSize,
  onClick,
  onHover,
}: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const groupRef = useRef<THREE.Group>(null);
  const imageGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Surface position (where the line starts)
  const surfacePosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.001);
  }, [marker.lat, marker.lng, radius]);

  // Top of the line (where the image is) - positioned further out to prevent going inside globe
  const topPosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.18);
  }, [marker.lat, marker.lng, radius]);

  const lineHeight = topPosition.distanceTo(surfacePosition);

  // Check if marker is facing the camera
  useFrame(() => {
    if (!imageGroupRef.current) return;

    // Get the world position of the image (the positioned element)
    const worldPos = new THREE.Vector3();
    imageGroupRef.current.getWorldPosition(worldPos);

    // Direction from globe center (0,0,0) to marker
    const markerDirection = worldPos.clone().normalize();

    // Direction from globe center to camera
    const cameraDirection = camera.position.clone().normalize();

    // Dot product: positive means facing camera, negative means behind
    const dot = markerDirection.dot(cameraDirection);

    // Show marker only if it's facing the camera (stricter threshold)
    setIsVisible(dot > 0.1);
  });

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
    onHover?.(marker);
  }, [marker, onHover]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick?.(marker);
  }, [marker, onClick]);

  // Calculate line center and orientation
  const { lineCenter, lineQuaternion } = useMemo(() => {
    const center = surfacePosition.clone().lerp(topPosition, 0.5);

    // Calculate rotation to align cylinder with the direction from surface to top
    const direction = topPosition.clone().sub(surfacePosition).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return { lineCenter: center, lineQuaternion: quaternion };
  }, [surfacePosition, topPosition]);

  return (
    <group ref={groupRef} visible={isVisible}>
      {/* Pin line from surface to image - properly oriented */}
      <mesh position={lineCenter} quaternion={lineQuaternion}>
        <cylinderGeometry args={[0.003, 0.003, lineHeight, 8]} />
        <meshBasicMaterial
          color={hovered ? '#ffffff' : '#94a3b8'}
          transparent
          opacity={hovered ? 0.9 : 0.6}
        />
      </mesh>

      {/* Pin point at the surface */}
      <mesh position={surfacePosition} quaternion={lineQuaternion}>
        <coneGeometry args={[0.015, 0.04, 8]} />
        <meshBasicMaterial color={hovered ? '#f97316' : '#ef4444'} />
      </mesh>

      {/* Circular image at the top */}
      <group ref={imageGroupRef} position={topPosition}>
        <Html
          transform
          center
          sprite
          distanceFactor={10}
          occlude={false}
          zIndexRange={[100, 0]}
          style={{
            pointerEvents: isVisible ? 'auto' : 'none',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.15s ease-out',
          }}
        >
          <div
            className="relative cursor-pointer"
            onMouseEnter={handlePointerEnter}
            onMouseLeave={handlePointerLeave}
            onClick={handleClick}
          >
            {/* Profile marker */}
            <div
              className={cn(
                'overflow-hidden rounded-lg bg-neutral-900 shadow-lg transition-all duration-200',
                hovered && 'scale-75 shadow-xl ring-2 ring-white/70',
              )}
              style={{
                width: '8px',
                height: '8px',
              }}
            >
              <img
                src={marker.src}
                alt={marker.label || 'Marker'}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>

            {/* Hover tooltip */}
            {hovered && marker.label && (
              <div
                className="absolute bottom-full left-1/2 z-50 mb-2 whitespace-nowrap"
                style={{
                  pointerEvents: 'none',
                  transform: 'translateX(-50%) translateZ(0)',
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'geometricPrecision',
                }}
              >
                <div
                  className="rounded-lg border border-white/10 bg-neutral-950/95 px-2 py-1 font-medium text-white shadow-2xl"
                  style={{
                    fontSize: '6px',
                    lineHeight: '10px',
                    transform: 'translateZ(0)',
                  }}
                >
                  {marker.label}
                </div>
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

// ============================================================================
// Rotating Globe with Markers (all rotate together)
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load Earth textures
  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl,
    config.bumpMapUrl,
  ]);

  // Configure textures
  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
  }, [earthTexture, bumpTexture]);

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 64, 64);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  return (
    <group ref={groupRef}>
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Wireframe overlay */}
      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* Markers - now inside the rotating group */}
      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          defaultSize={config.markerSize}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Atmosphere Component (stays static - doesn't rotate)
// ============================================================================

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  // blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
  // We invert it so higher blur value = more diffuse (lower exponent)
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }: SceneProps) {
  const { camera } = useThree();

  // Set initial camera position (pulled back to accommodate markers)
  React.useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.5);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      {/* Rotating Globe with Markers */}
      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
      />

      {/* Atmosphere (static) */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex shrink-0 flex-col items-center gap-3">
        <span className="inline-block shrink-0 text-sm text-neutral-400">
          Loading globe...
        </span>
      </div>
    </Html>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: '#1a1a2e',
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: '#4da6ff',
  atmosphereIntensity: 0.5,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.3,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.06,
  showWireframe: false,
  wireframeColor: '#4a9eff',
  ambientIntensity: 0.6,
  pointLightIntensity: 1.5,
  backgroundColor: null,
};
export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  // const [selectedMarker, setSelectedMarker] =
  //   useState<GlobeMarker | null>(null);

  const handleMarkerClick = useCallback(
    (marker: GlobeMarker) => {
      onMarkerClick?.(marker);
    },
    [onMarkerClick],
  );
  return (
    <div className={cn('relative w-full', className)}>
      {/* Globe */}
      <div className="relative h-[500px] w-full">
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
          camera={{
            fov: 45,
            near: 0.1,
            far: 1000,
            position: [0, 0, mergedConfig.radius * 3.5],
          }}
          style={{
            background: mergedConfig.backgroundColor || 'transparent',
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Scene
              markers={markers}
              config={mergedConfig}
              onMarkerClick={handleMarkerClick}
              onMarkerHover={onMarkerHover}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Selected Contributor */}
      {/* {selectedMarker?.profile && (
        <div className="mx-auto mt-8 w-full max-w-2xl px-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 p-6 backdrop-blur-xl">
            {/* Close *
            <button
              onClick={() => setSelectedMarker(null)}
              className="absolute right-4 top-4 text-neutral-500 transition-colors hover:text-white"
              aria-label="Close profile"
            >
              ×
            </button>

            <div className="flex items-start gap-5">
              {/* Profile image *
              <img
                src={
                  selectedMarker.profile.image ||
                  selectedMarker.src
                }
                alt={selectedMarker.profile.name}
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-white/10"
              />

              {/* Main info *
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {selectedMarker.profile.name}
                </h3>

                {selectedMarker.profile.roles &&
                  selectedMarker.profile.roles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedMarker.profile.roles.map(
                        (role, index) => (
                          <span
                            key={`${role}-${index}`}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300"
                          >
                            {role}
                          </span>
                        ),
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Contact / links *
            {(selectedMarker.profile.email ||
              selectedMarker.profile.github ||
              selectedMarker.profile.linkedin ||
              selectedMarker.profile.website) && (
              <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                {selectedMarker.profile.email && (
                  <a
                    href={`mailto:${selectedMarker.profile.email}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    Email
                  </a>
                )}

                {selectedMarker.profile.github && (
                  <a
                    href={selectedMarker.profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    GitHub ↗
                  </a>
                )}

                {selectedMarker.profile.linkedin && (
                  <a
                    href={selectedMarker.profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    LinkedIn ↗
                  </a>
                )}

                {selectedMarker.profile.website && (
                  <a
                    href={selectedMarker.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    Website ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
export default Globe3D;
