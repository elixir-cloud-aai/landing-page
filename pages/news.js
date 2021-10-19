import Head from "next/head";
import NewsComponent from "../components/News";

const News = () => {
  return (
    <div>
      <Head>
        <title>News</title>
      </Head>
      <NewsComponent></NewsComponent>
    </div>
  );
};

export default News;
