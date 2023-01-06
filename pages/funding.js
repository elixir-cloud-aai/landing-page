import React from "react";
import { NextSeo } from "next-seo";
import Funders from "../components/Funders";
import getFunders from "../utils/funder";

function Funding({ funders }) {
  return (
    <>
      <NextSeo
        title="Funding"
        description="ELIXIR Cloud & AAI collobrative funders."
      />
      <Funders funders={funders} />
    </>
  );
}

export const getStaticProps = async () => {
  const data = await getFunders();

  return {
    props: {
      funders: data,
    },
    revalidate: 30,
  };
};

export default Funding;
