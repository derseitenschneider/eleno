import parse from 'html-react-parser'
import { TNews } from '../../../../types/types'
import { formatDateToDisplay } from '../../../../utils/formateDate'

interface NewsItemProps {
  news: TNews
}

function NewsItem({ news }: NewsItemProps) {
  return (
    <div className="news-item">
      <span className="date">{formatDateToDisplay(news.date)}</span>
      <h3 className="heading-4">{news.title}</h3>
      <div className="news-text">{parse(news.text)}</div>
    </div>
  )
}

export default NewsItem
