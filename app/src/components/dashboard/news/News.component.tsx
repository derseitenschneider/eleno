import news from './news'
import './news.style.scss'
import NewsItem from './newsItem/NewsItem.component'

function News() {
  const sortedNews = news.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  )

  return (
    <aside className="news">
      <h2 className="heading-2">News</h2>
      <div className="wrapper-news">
        {sortedNews
          .sort((newsA, newsB) => +newsA.date - +newsB.date)
          .map((currentNews) => (
            <NewsItem news={currentNews} key={currentNews.date} />
          ))}
      </div>
    </aside>
  )
}

export default News
