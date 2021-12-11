import OverviewComponent from "../components/Overview";
import { NextSeo } from "next-seo";
import getOverview from "../utils/overview";

const Overview = ({ overview }) => {
  return (
    <>
      <NextSeo title="Overview" />
      <OverviewComponent data={overview} />
    </>
  );
};

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
