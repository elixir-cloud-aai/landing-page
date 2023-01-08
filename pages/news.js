import { NextSeo } from 'next-seo';
import NewsComponent from '../components/News';

function News() {
  return (
    <>
      <NextSeo
        description="ELIXIR Cloud & AAI latest news/twitter feed."
        title="News & FAQ's"
      />
      <NewsComponent />
    </>
  );
}

export default News;
