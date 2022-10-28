import { TwitterTimelineEmbed } from "react-twitter-embed";
import ContentLoader from "react-content-loader";
import { useContext } from "react";
import DarkModeContext from "../context/darkMode";
import Zoom from "react-reveal/Zoom";

const News = () => {
  const darkMode = useContext(DarkModeContext);
  const renderLoading = () => {
    return (
      <>
        <ContentLoader
          speed={2}
          viewBox="0 0 476 124"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
          <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
          <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
          <circle cx="20" cy="20" r="20" />
        </ContentLoader>
        <hr className="mb-5"></hr>
        <ContentLoader
          speed={2}
          viewBox="0 0 476 124"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
          <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
          <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
          <circle cx="20" cy="20" r="20" />
        </ContentLoader>
        <hr className="mb-5"></hr>
        <ContentLoader
          speed={2}
          viewBox="0 0 476 124"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
          <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
          <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
          <circle cx="20" cy="20" r="20" />
        </ContentLoader>
        <hr className="mb-5"></hr>
      </>
    );
  };

  return (
    <Zoom>
      <div className="mt-32 md:mx-96 mx-5">
        <TwitterTimelineEmbed
          key={darkMode}
          sourceType="profile"
          userId={1438493005950947328}
          noFooter={true}
          placeholder={renderLoading()}
          theme={darkMode ? "dark" : "light"}
          transparent={true}
        />
        {/* <TwitterTimelineEmbed
          key={darkMode}
          sourceType="list"
          id="1565348349200347136"
          noFooter={true}
          placeholder={renderLoading()}
          theme={darkMode ? "dark" : "light"}
          transparent={true}
        /> */}
      </div>
    </Zoom>
  );
};

export default News;
