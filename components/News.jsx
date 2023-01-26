import { useContext } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import ContentLoader from 'react-content-loader';
import Zoom from 'react-reveal/Zoom';
import themeContext from '../context/defaultTheme';

function News() {
  const theme = useContext(themeContext);
  const renderLoading = () => (
    <>
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        speed={2}
        viewBox="0 0 476 124"
      >
        <rect height="6" rx="3" ry="3" width="88" x="48" y="8" />
        <rect height="6" rx="3" ry="3" width="88" x="48" y="8" />
        <rect height="6" rx="3" ry="3" width="52" x="48" y="26" />
        <rect height="6" rx="3" ry="3" width="410" x="0" y="56" />
        <rect height="6" rx="3" ry="3" width="380" x="0" y="72" />
        <rect height="6" rx="3" ry="3" width="178" x="0" y="88" />
        <circle cx="20" cy="20" r="20" />
      </ContentLoader>
      <hr className="mb-5" />
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        speed={2}
        viewBox="0 0 476 124"
      >
        <rect height="6" rx="3" ry="3" width="88" x="48" y="8" />
        <rect height="6" rx="3" ry="3" width="88" x="48" y="8" />
        <rect height="6" rx="3" ry="3" width="52" x="48" y="26" />
        <rect height="6" rx="3" ry="3" width="410" x="0" y="56" />
        <rect height="6" rx="3" ry="3" width="380" x="0" y="72" />
        <rect height="6" rx="3" ry="3" width="178" x="0" y="88" />
        <circle cx="20" cy="20" r="20" />
      </ContentLoader>
      <hr className="mb-5" />
      <ContentLoader
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        speed={2}
        viewBox="0 0 476 124"
      >
        <rect height="6" rx="3" ry="3" width="88" x="48" y="8" />
        <rect height="6" rx="3" ry="3" width="88" x="48" y="8" />
        <rect height="6" rx="3" ry="3" width="52" x="48" y="26" />
        <rect height="6" rx="3" ry="3" width="410" x="0" y="56" />
        <rect height="6" rx="3" ry="3" width="380" x="0" y="72" />
        <rect height="6" rx="3" ry="3" width="178" x="0" y="88" />
        <circle cx="20" cy="20" r="20" />
      </ContentLoader>
      <hr className="mb-5" />
    </>
  );

  return (
    <Zoom>
      <div className="mt-32 md:mx-96 mx-5">
        <TwitterTimelineEmbed
          key={theme}
          noFooter
          noHeader
          placeholder={renderLoading()}
          sourceType="profile"
          theme={theme === 'light' ? 'light' : 'dark'}
          transparent
          userId="1586382856267464708"
        />
      </div>
    </Zoom>
  );
}

export default News;
