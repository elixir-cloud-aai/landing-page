import SolutionsComponent from "../components/Solutions";
import { NextSeo } from "next-seo";
import getSolutions from "../utils/solutions";

const Solutions = ({ solutions }) => {
  return (
    <>
      <NextSeo title="Solutions" description="ELIXIR Cloud & AAI-developed solutions." />
      <SolutionsComponent solutions={solutions}></SolutionsComponent>
    </>
  );
};

export const getStaticProps = async () => {
  const data = await getSolutions();
  return {
    props: {
      solutions: data,
    },
    revalidate: 30,
  };
};

export default Solutions;
