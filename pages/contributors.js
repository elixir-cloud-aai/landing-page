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
  try {
    const data = await getContributors();
    if (data.error) {
      console.error('Error fetching contributors:', data.error);
      return {
        props: {
          contributors: [],
          error: 'Error fetching contributors',
        },
        revalidate: 30,
      };
    }
    return {
      props: {
        contributors: data,
        error: null,
      },
      revalidate: 30,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);

    return {
      props: {
        contributors: [],
        error: 'server error',
      },
      revalidate: 30,
    };
  }
};

export default Contributors;
