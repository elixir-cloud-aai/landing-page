import axios from "axios";
import { server } from "../config";
import Head from "next/head";
import GuidesComponent from "../components/Guides";

const Guides = ({ guides }) => {
  return (
    <div>
      <Head>
        <title>Guides & FAQs</title>
      </Head>
      <GuidesComponent guides={guides}></GuidesComponent>
    </div>
  );
};

export const getStaticProps = async () => {
  const { data } = await axios.get(`${server}/api/guides`);

  return {
    props: {
      guides: data,
    },
    revalidate: 30,
  };
};

export default Guides;
