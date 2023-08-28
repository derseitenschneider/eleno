import { FunctionComponent } from 'react'
import { TNews } from '../../../types/types'
import { formatDateToDisplay } from '../../../utils/formateDate'

interface NewsItemProps {
  news: TNews
}

const NewsItem: FunctionComponent<NewsItemProps> = ({ news }) => {
  return (
    <div className="news-item">
      <span className="date">{formatDateToDisplay(news.date)}</span>
      <h3 className="heading-4">{news.title}</h3>
      <p className="news-text">{news.text}</p>
    </div>
  )
}

export default NewsItem
