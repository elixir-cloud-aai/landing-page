import GuidesComponent from "../components/Guides";
import { NextSeo } from "next-seo";
import getGuides from "../utils/guides";

const Guides = ({ guides }) => {
  return (
    <>
      <NextSeo title="Guides" />
      <GuidesComponent guides={guides}></GuidesComponent>
    </>
  );
};

export const getStaticProps = async () => {
  const data = await getGuides();

  return {
    props: {
      guides: data,
    },
    revalidate: 30,
  };
};

export default Guides;
