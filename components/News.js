import { TwitterTweetEmbed } from 'react-twitter-embed'
import ContentLoader from 'react-content-loader'
import { useContext } from 'react'
import DarkModeContext from '../context/darkMode'
import Zoom from 'react-reveal/Zoom'
import { useState } from 'react'
import axios from 'axios'
import { elixirBackend } from '../config'

const News = ({ news }) => {
  const [stateNews, setStateNews] = useState(news)
  const [nextToken, setNextToken] = useState(news.meta.next_token)
  const darkMode = useContext(DarkModeContext)
  const renderLoading = () => {
    return (
      <div className="px-14 pt-3">
        <ContentLoader
          speed={2}
          viewBox="0 0 476 124"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
          <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
          <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
          <circle cx="20" cy="20" r="20" />
        </ContentLoader>
      </div>
    )
  }

  const renderNews = () => {
    return stateNews.data.map((item, index) => {
      return (
        <Zoom key={item.id}>
          <TwitterTweetEmbed
            // key={item.id}
            key={darkMode}
            tweetId={item.id}
            transparent={true}
            placeholder={renderLoading()}
            options={{
              theme: darkMode ? 'dark' : 'light',
              conversation: 'none',
              align: 'center',
              width: '550',
              height: '100%',
              lang: 'en',
            }}
          />
        </Zoom>
      )
    })
  }

  const handleLoadMore = async () => {
    console.log(nextToken)
    if (nextToken) {
      try {
        const res = await axios.get(
          `${elixirBackend}/news?next_token=${nextToken}`
        )
        console.log(res)
        const newNews = res.data
        setStateNews({
          data: [...stateNews.data, ...newNews.data],
          meta: newNews.meta,
        })
        setNextToken(newNews.meta.next_token)
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <Zoom>
      <div className="mt-32 md:mx-96 mx-5 p-2">
        {renderNews()}
        <div
          onClick={() => handleLoadMore()}
          className="cursor-pointer p-2 text-twitter border border-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 hover:bg-gray-100 rounded-3xl text-center font-extrabold text-sm sm:mx-14"
        >
          Load More...
        </div>
      </div>
    </Zoom>
  )
}

export default News
