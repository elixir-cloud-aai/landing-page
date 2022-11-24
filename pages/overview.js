import React from "react";
import { NextSeo } from "next-seo";
import OverviewComponent from "../components/Overview";
import getOverview from "../utils/overview";

function Overview({ overview }) {
  return (
    <>
      <NextSeo title="Overview" />
      <OverviewComponent data={overview} />
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getOverview();

  return {
    props: {
      overview: data,
    },
    revalidate: 30,
  };
};

export default Overview;
