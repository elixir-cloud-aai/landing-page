import Head from "next/head";
import { server } from "../config";
import axios from "axios";
import OverviewComponent from "../components/overview";

const Overview = ({ overview }) => {
  return (
    <div>
      <Head>
        <title>Overview</title>
      </Head>
      <OverviewComponent data={overview} />
    </div>
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
