import { TNews } from '../../../types/types'
import './news.style.scss'
import { FunctionComponent } from 'react'
import NewsItem from './newsItem/NewsItem.component'
import news from './news'

interface NewsProps {}

const News: FunctionComponent<NewsProps> = () => {
  const sortedNews = news.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date)
  )

  return (
    <aside className="news">
      <h2 className="heading-2">News</h2>
      <div className="wrapper-news">
        {sortedNews
          .sort((newsA, newsB) => +newsA.date - +newsB.date)
          .map((news, index) => (
            <NewsItem news={news} key={index} />
          ))}
      </div>
    </aside>
  )
}

export default News
