import type { ReactNode } from 'react';
import { Reveal } from 'react-awesome-reveal';

// The zoom entrance of react-awesome-reveal 4 (`<Zoom>`, from animate.css
// `zoomIn`): 1 s, `ease`, scaling up from 30% while fading in over the first
// half. Version 5 dropped the effect components, so `Reveal` gets the same
// keyframes. The entrance plays once.
const zoomInKeyframes: Keyframe[] = [
  {
    offset: 0,
    easing: 'ease',
    opacity: 0,
    transform: 'scale3d(0.3, 0.3, 0.3)',
  },
  { offset: 0.5, easing: 'ease', opacity: 1 },
  { offset: 1, opacity: 1, transform: 'none' },
];

const ZOOM_IN_DURATION = 1000;

const ZoomIn = ({ children }: { children: ReactNode }) => (
  <Reveal duration={ZOOM_IN_DURATION} keyframes={zoomInKeyframes}>
    {children}
  </Reveal>
);

export default ZoomIn;
