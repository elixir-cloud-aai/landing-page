import ContributorsComponent from "../components/Contributors";
import { NextSeo } from "next-seo";
import getContributors from "../utils/contributors";

const Contributors = ({ contributors }) => {
  return (
    <>
      <NextSeo
        title="Contributors"
        description="Elixir Cloud & AAI contributor devloping the solutions. "
      />
      <ContributorsComponent contributors={contributors}></ContributorsComponent>
    </>
  );
};

export const getStaticProps = async () => {
  const data = await getContributors();

  return {
    props: {
      contributors: data,
    },
    revalidate: 30,
  };
};

export default Contributors;
