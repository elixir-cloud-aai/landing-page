import { NextSeo } from 'next-seo';
import ContributorsComponent from '../components/Contributors';
import getContributors from '../utils/contributors';

function Contributors({ contributors }) {
  return (
    <>
      <NextSeo
        description="Elixir Cloud & AAI contributor devloping the solutions. "
        title="Contributors"
      />
      <ContributorsComponent contributors={contributors} />
    </>
  );
}

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
