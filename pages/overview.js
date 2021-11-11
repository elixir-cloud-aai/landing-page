import { server } from "../config";
import axios from "axios";
import OverviewComponent from "../components/Overview";
import { NextSeo } from "next-seo";

const Overview = ({ overview }) => {
  return (
    <>
      <NextSeo title="Overview" />
      <OverviewComponent data={overview} />
    </>
  );
};

export const getStaticProps = async () => {
  const { data } = await axios.get(`${server}/api/overview`);

  return {
    props: {
      overview: data,
    },
    revalidate: 30,
  };
};

export default Overview;
