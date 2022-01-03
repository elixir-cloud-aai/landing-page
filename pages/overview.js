import OverviewComponent from '../components/Overview'
import { NextSeo } from 'next-seo'
import axios from 'axios'
import { elixirBackend } from '../config'

const Overview = ({ overview }) => {
  return (
    <>
      <NextSeo title="Overview" />
      <OverviewComponent data={overview} />
    </>
  )
}

export const getStaticProps = async () => {
  const { data } = await axios.get(`${elixirBackend}/overview`)

  return {
    props: {
      overview: data,
    },
    revalidate: 30,
  }
}

export default Overview
