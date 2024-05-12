import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import news from "./news"
// import './news.style.scss'
import NewsItem from "./newsItem/NewsItem.component"

function News() {
  const sortedNews = news.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  )

  return (
    <aside className='sm:row-start-2 border-t overflow-hidden min-[900px]:border-t-0 min-[900px]:border-l border-hairline row-end-4 col-start-2'>
      <h2>News</h2>
      {/* <div className='h-[500px] min-[900px]:h-full w-full overflow-y-auto no-scrollbar'>
        {sortedNews
          .sort((newsA, newsB) => +newsA.date - +newsB.date)
          .map((currentNews) => (
            <NewsItem news={currentNews} key={currentNews.date} />
          ))}
      </div> */}
      <ScrollArea className='h-full'>
        <ScrollBar orientation='vertical' />
        {sortedNews
          .sort((newsA, newsB) => +newsA.date - +newsB.date)
          .map((currentNews) => (
            <NewsItem news={currentNews} key={currentNews.date} />
          ))}
      </ScrollArea>
    </aside>
  )
}

export default News
