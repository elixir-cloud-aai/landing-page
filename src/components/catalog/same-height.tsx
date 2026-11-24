'use client';

import { useEffect } from 'react';

/**
 * Gives the elements marked `data-same-height={group}` the height of the
 * tallest of them, e.g. the cards of one type in several sections: a grid
 * (`auto-rows-fr`) evens out only its own cards. Renders nothing; heights
 * follow the window width and the loaded fonts.
 */
export function SameHeight({ group }: { group: string }) {
  useEffect(() => {
    const update = () => {
      const items = Array.from(
        document.querySelectorAll<HTMLElement>(`[data-same-height="${group}"]`),
      );
      // Measure the natural heights first
      items.forEach((item) => {
        item.style.minHeight = '';
      });
      const tallest = Math.max(
        0,
        ...items.map((item) => item.getBoundingClientRect().height),
      );
      items.forEach((item) => {
        item.style.minHeight = `${tallest}px`;
      });
    };

    update();
    window.addEventListener('resize', update);
    // Fonts change the heights once they load; jsdom has no `document.fonts`
    let active = true;
    document.fonts?.ready.then(() => active && update());
    return () => {
      active = false;
      window.removeEventListener('resize', update);
    };
  }, [group]);

  return null;
}
