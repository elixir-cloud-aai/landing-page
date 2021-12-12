import PartnersComponent from "../components/Partners";
import { NextSeo } from "next-seo";
import getPartners from "../utils/partners";

const Partners = ({ partners }) => {
  return (
    <>
      <NextSeo title="Partners" description="ELIXIR Cloud & AAI collobrative partners." />
      <PartnersComponent partners={partners}></PartnersComponent>
    </>
  );
};

export const getStaticProps = async () => {
  const data = await getPartners();

  return {
    props: {
      partners: data,
    },
    revalidate: 30,
  };
};

export default Partners;
