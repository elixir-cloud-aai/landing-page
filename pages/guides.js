import GuidesComponent from '../components/Guides'
import { NextSeo } from 'next-seo'
import axios from 'axios'
import { elixirBackend } from '../config'

const Guides = ({ guides }) => {
  return (
    <>
      <NextSeo title="Guides" />
      <GuidesComponent guides={guides}></GuidesComponent>
    </>
  )
}

export const getStaticProps = async () => {
  const { data } = await axios.get(`${elixirBackend}/guides`)

  return {
    props: {
      guides: data,
    },
    revalidate: 30,
  }
}

export default Guides
