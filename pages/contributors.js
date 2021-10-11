import Head from "next/head";
import axios from "axios";
import { server } from "../config";
import ContributorsComponent from "../components/Contributors";

const Contributors = ({ contributors }) => {
  return (
    <div>
      <Head>
        <title>Contributors</title>
      </Head>
      <ContributorsComponent contributors={contributors}></ContributorsComponent>
    </div>
  );
};

export const getStaticProps = async () => {
  const { data } = await axios.get(`${server}/api/contributors`);

  return {
    props: {
      contributors: data,
    },
    revalidate: 30,
  };
};

export default Contributors;
