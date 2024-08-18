'use client';
import { useContext, FC } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import ContentLoader from 'react-content-loader';
import { Zoom } from 'react-awesome-reveal';
import themeContext from '../../context/default-theme';

const News: FC<any> = () => {
  const context = useContext(themeContext);
  const renderLoading = () => (
    <div className="border rounded-lg dark:border-gray-700">
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        speed={2}
        viewBox="0 0 476 70"
      >
        <rect height="6" rx="3" ry="3" width="88" x="48" y="10" />
        <rect height="5" rx="3" ry="3" width="410" x="48" y="30" />
        <rect height="5" rx="3" ry="3" width="410" x="48" y="45" />
        <circle cx="20" cy="20" r="13" />
      </ContentLoader>
      <hr className="mb-5 dark:border-gray-700" />
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        speed={2}
        viewBox="0 0 476 70"
      >
        <rect height="6" rx="3" ry="3" width="88" x="48" y="10" />
        <rect height="5" rx="3" ry="3" width="410" x="48" y="30" />
        <rect height="5" rx="3" ry="3" width="410" x="48" y="45" />
        <circle cx="20" cy="20" r="13" />
      </ContentLoader>
      <hr className="mb-5 dark:border-gray-700" />
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        speed={2}
        viewBox="0 0 476 70"
      >
        <rect height="6" rx="3" ry="3" width="88" x="48" y="10" />
        <rect height="5" rx="3" ry="3" width="410" x="48" y="30" />
        <rect height="5" rx="3" ry="3" width="410" x="48" y="45" />
        <circle cx="20" cy="20" r="13" />
      </ContentLoader>
    </div>
  );

  return (
    <Zoom>
      <div className="mt-32 md:mx-96 mx-5 dark:bg-gray-900 rounded-xl">
        <TwitterTimelineEmbed
          key={context?.theme}
          noFooter
          noHeader
          placeholder={renderLoading()}
          screenName="egc_news"
          sourceType="profile"
          theme={context?.theme === 'light' ? 'light' : 'dark'}
          transparent
        />
      </div>
    </Zoom>
  );
};

export default News;
