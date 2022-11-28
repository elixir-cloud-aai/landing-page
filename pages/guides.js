import React from "react";
import { NextSeo } from "next-seo";
import GuidesComponent from "../components/Guides";
import getGuides from "../utils/guides";

function Guides({ guides }) {
  return (
    <>
      <NextSeo title="Guides" />
      <GuidesComponent guides={guides} />
    </>
  );
}

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
