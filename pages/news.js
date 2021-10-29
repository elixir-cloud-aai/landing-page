import NewsComponent from "../components/News";
import { NextSeo } from "next-seo";

const News = () => {
  return (
    <>
      <NextSeo title="News & FAQ's" description="Elixir Cloud & AAI latest news/twitter feed." />
      <NewsComponent></NewsComponent>
    </>
  );
};

export default News;
