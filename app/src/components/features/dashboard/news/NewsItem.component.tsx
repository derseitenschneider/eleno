import parse from "html-react-parser"
import type { News } from "../../../../types/types"
import { formatDateToDisplay } from "../../../../utils/formateDate"

interface NewsItemProps {
  news: News
}

function NewsItem({ news }: NewsItemProps) {
  return (
    <div className='pb-7 mb-7 border-b border-hairline'>
      <span className='text-sm'>{formatDateToDisplay(news.date)}</span>
      <h5>{news.title}</h5>
      <div className='flex flex-col gap-3 text-sm'>{parse(news.text)}</div>
    </div>
  )
}

export default NewsItem
