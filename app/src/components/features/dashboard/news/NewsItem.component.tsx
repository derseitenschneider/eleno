import parse from 'html-react-parser'
import type { News } from '../../../../types/types'
import { useUserLocale } from '@/services/context/UserLocaleContext'

interface NewsItemProps {
  news: News
}

function NewsItem({ news }: NewsItemProps) {
  const { userLocale } = useUserLocale()
  const date = new Date(news.date).toLocaleString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  return (
    <div className='pb-7 mb-7 border-b border-hairline'>
      <span className='text-sm'>{date}</span>
      <h5>{news.title}</h5>
      <div className='flex flex-col gap-3 text-sm'>{parse(news.text)}</div>
    </div>
  )
}

export default NewsItem
