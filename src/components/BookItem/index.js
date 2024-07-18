import {withRouter} from 'react-router-dom'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'

const BookItem = props => {
  const onClickBookItem = () => {
    const {eachItem} = props
    const {id} = eachItem
    const {history} = props
    history.push(`/books/${id}`)
  }

  const {eachItem} = props
  const {authorName, coverPic, title, rating, readStatus} = eachItem
  return (
    <li className="book-item-list-container">
      <div className="book-item-btn">
        <button
          className="book-item-btn"
          onClick={onClickBookItem}
          type="button"
        >
          <img className="book-item-cover-pic" src={coverPic} alt={title} />
        </button>
      </div>
      <div className="book-item-details-card-container">
        <h1 className="book-item-title">{title}</h1>
        <p className="book-item-author-name">{authorName}</p>
        <div className="book-item-avg-rating-container">
          <p className="book-item-avg-rating">Avg Rating</p>
          <BsFillStarFill className="book-item-start-icon" />
          <p className="book-item-rating">{rating}</p>
        </div>
        <p className="book-item-status-heading">
          Status: <span className="book-item-status">{readStatus}</span>
        </p>
      </div>
    </li>
  )
}

export default withRouter(BookItem)
