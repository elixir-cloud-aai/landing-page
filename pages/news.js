import NewsComponent from '../components/News'
import { NextSeo } from 'next-seo'
import axios from 'axios'
import { elixirBackend } from '../config'

const News = ({ news }) => {
  return (
    <>
      <NextSeo
        title="News & FAQ's"
        description="ELIXIR Cloud & AAI latest news/twitter feed."
      />
      <NewsComponent news={news}></NewsComponent>
    </>
  )
}

export const getStaticProps = async () => {
  const { data } = await axios.get(`${elixirBackend}/news`)
  return {
    props: {
      news: data,
    },
    revalidate: 30,
  }
}

export default News
