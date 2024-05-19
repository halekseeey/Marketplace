import styles from './ReviewList.module.css'
import Star from '../../../public/star.svg'
import ReviewCard from './ReviewCard'
import Button from '../UI/Button/Button'
import useSWRInfinite from 'swr/infinite'

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null
  return `https://jsonplaceholder.typicode.com/comments?_page=${
    pageIndex + 1
  }&_limit=2`
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface Comment {
  assetId: number
  id: number
  name: string
  email: string
  body: string
}

/**
 * Карточка отображения списка отзывов
 */

const ReviewList = () => {
  const { data, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  })

  const reviews = data ? [].concat(...data) : []

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.mark}>
          <h1>4,5</h1>
          <div className={styles.stars}>
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {reviews.map((item: Comment) => {
          return (
            <ReviewCard
              key={item.id}
              username={item.email}
              stars={4}
              review={item.body}
              date={'23.01.23 17:43'}
            />
          )
        })}
      </div>
      <div className={styles.footer}>
        <Button
          variant={'outlined'}
          onClick={() => setSize(size + 1)}
          disabled={isLoading}
        >
          Показать ещё
        </Button>
      </div>
    </div>
  )
}

export default ReviewList
