'use client';

import { useContext, FC, useEffect, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { Zoom } from 'react-awesome-reveal';
import themeContext from '@/context/default-theme';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element: HTMLDivElement) => void;
      };
    };
  }
}

const News: FC = () => {
  const context = useContext(themeContext);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const theme = context?.theme === 'light' ? 'light' : 'dark';

  useEffect(() => {
    if (!timelineRef.current) return;

    setLoaded(false);

    const existingScript = document.querySelector(
      'script[src="https://platform.twitter.com/widgets.js"]',
    );

    const loadTimeline = () => {
      if (window.twttr?.widgets && timelineRef.current) {
        window.twttr.widgets.load(timelineRef.current);
        setLoaded(true);
      }
    };

    if (existingScript) {
      if (window.twttr?.widgets) {
        loadTimeline();
      } else {
        existingScript.addEventListener('load', loadTimeline);
      }

      return () => {
        existingScript.removeEventListener('load', loadTimeline);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    script.onload = loadTimeline;

    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [theme]);

  const renderLoading = () => (
    <div className="rounded-lg border dark:border-gray-700">
      {[1, 2, 3].map((item) => (
        <div key={item}>
          <ContentLoader
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            speed={2}
            viewBox="0 0 476 70"
            width="100%"
            height={70}
          >
            <rect height="6" rx="3" ry="3" width="88" x="48" y="10" />
            <rect height="5" rx="3" ry="3" width="410" x="48" y="30" />
            <rect height="5" rx="3" ry="3" width="410" x="48" y="45" />
            <circle cx="20" cy="20" r="13" />
          </ContentLoader>

          {item < 3 && <hr className="mb-5 dark:border-gray-700" />}
        </div>
      ))}
    </div>
  );

  return (
    <Zoom>
      <div className="mx-5 mt-32 rounded-xl dark:bg-gray-900 md:mx-96">
        {!loaded && renderLoading()}

        <div ref={timelineRef} className={loaded ? 'block' : 'hidden'}>
          <a
            className="twitter-timeline"
            data-theme={theme}
            data-chrome="noheader nofooter transparent"
            data-height="600"
            href="https://twitter.com/egc_news"
          >
            Tweets by @egc_news
          </a>
        </div>
      </div>
    </Zoom>
  );
};

export default News;
