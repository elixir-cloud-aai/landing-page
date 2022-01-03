import PartnersComponent from '../components/Partners'
import { NextSeo } from 'next-seo'
import { elixirBackend } from '../config'
import axios from 'axios'

const Partners = ({ partners }) => {
  return (
    <>
      <NextSeo
        title="Partners"
        description="ELIXIR Cloud & AAI collobrative partners."
      />
      <PartnersComponent partners={partners}></PartnersComponent>
    </>
  )
}

export const getStaticProps = async () => {
  const { data } = await axios.get(`${elixirBackend}/partners`)

  return {
    props: {
      partners: data,
    },
    revalidate: 30,
  }
}

export default Partners
