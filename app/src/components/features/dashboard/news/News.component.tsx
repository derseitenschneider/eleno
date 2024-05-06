import news from "./news"
// import './news.style.scss'
import NewsItem from "./newsItem/NewsItem.component"

function News() {
  const sortedNews = news.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  )

  return (
    <aside className='sm:row-start-2 border-t min-[900px]:border-t-0 min-[900px]:border-l border-hairline overflow-hidden row-end-4 col-start-2'>
      <h2>News</h2>
      <div className='h-[500px] min-[900px]:h-full w-full overflow-y-auto no-scrollbar'>
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
