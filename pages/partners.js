import Head from "next/head";
import { server } from "../config";
import axios from "axios";
import PartnersComponent from "../components/Partners";

const Partners = ({ partners }) => {
  return (
    <>
      <Head>
        <title>Partners</title>
      </Head>
      <PartnersComponent partners={partners}></PartnersComponent>
    </>
  );
};

export const getStaticProps = async () => {
  const { data } = await axios.get(`${server}/api/partners`);

  return {
    props: {
      partners: data,
    },
    revalidate: 30,
  };
};

export default Partners;
