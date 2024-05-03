import parse from "html-react-parser"
import type { TNews } from "../../../../../types/types"
import { formatDateToDisplay } from "../../../../../utils/formateDate"

interface NewsItemProps {
  news: TNews
}

function NewsItem({ news }: NewsItemProps) {
  return (
    <div className='pb-7 mb-7 border-b'>
      <span className='text-sm'>{formatDateToDisplay(news.date)}</span>
      <h4>{news.title}</h4>
      <div className='flex flex-col gap-3 text-sm'>{parse(news.text)}</div>
    </div>
  )
}

export default NewsItem
