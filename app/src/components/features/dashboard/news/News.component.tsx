import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import NewsItem from './NewsItem.component'
import news from './news'

function News() {
  const sortedNews = news.sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  )

  return (
    <aside
      className={cn(
        'px-5 py-6',
        'md:p-6',
        'lg:p-4 lg:pl-6',
        'min-[900px]:p-4',
        'sm:row-start-2 border-t overflow-hidden min-[900px]:border-t-0 min-[900px]:border-l border-hairline row-end-4 col-start-2',
      )}
    >
      <h2>News</h2>
      <ScrollArea className='max-h-[400px] sm:max-h-screen sm:h-full'>
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
