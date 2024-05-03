import news from "./news"
// import './news.style.scss'
import NewsItem from "./newsItem/NewsItem.component"

function News() {
  const sortedNews = news.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  )

  return (
    <aside className='row-start-2 border-l overflow-hidden row-end-4 col-start-2'>
      <h2>News</h2>
      <div className='h-full overflow-y-auto no-scrollbar'>
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
