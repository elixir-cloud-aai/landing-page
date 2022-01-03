import ContributorsComponent from '../components/Contributors'
import { NextSeo } from 'next-seo'
import axios from 'axios'
import { elixirBackend } from '../config'

const Contributors = ({ contributors }) => {
  return (
    <>
      <NextSeo
        title="Contributors"
        description="Elixir Cloud & AAI contributor devloping the solutions. "
      />
      <ContributorsComponent
        contributors={contributors}
      ></ContributorsComponent>
    </>
  )
}

export const getStaticProps = async () => {
  const { data } = await axios.get(`${elixirBackend}/contributors`)

  return {
    props: {
      contributors: data,
    },
    revalidate: 30,
  }
}

export default Contributors
