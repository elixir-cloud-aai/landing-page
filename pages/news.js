import React from "react";
import { NextSeo } from "next-seo";
import NewsComponent from "../components/News";

function News() {
  return (
    <>
      <NextSeo
        title="News & FAQ's"
        description="ELIXIR Cloud & AAI latest news/twitter feed."
      />
      <NewsComponent />
    </>
  );
}

export default News;
