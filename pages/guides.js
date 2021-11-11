import axios from "axios";
import { server } from "../config";
import GuidesComponent from "../components/Guides";
import { NextSeo } from "next-seo";

const Guides = ({ guides }) => {
  return (
    <>
      <NextSeo title="Guides" />
      <GuidesComponent guides={guides}></GuidesComponent>
    </>
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
