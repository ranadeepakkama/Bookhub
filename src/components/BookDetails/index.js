import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, bookDetailsData: []}

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookie.get('jwt_token')
    const bookDetailsUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(bookDetailsUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const bookDetails = fetchedData.book_details
      const updatedData = {
        id: bookDetails.id,
        title: bookDetails.title,
        aboutAuthor: bookDetails.about_author,
        aboutBook: bookDetails.about_book,
        authorName: bookDetails.author_name,
        coverPic: bookDetails.cover_pic,
        rating: bookDetails.rating,
        readStatus: bookDetails.read_status,
      }
      console.log(updatedData)

      this.setState({
        bookDetailsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderBookDetailsStats = () => {
    const {bookDetailsData} = this.state
    return (
      <>
        <div className="book-img-author-container">
          <img
            src={bookDetailsData.coverPic}
            alt={bookDetailsData.title}
            className="coverPic-book"
          />
          <div className="author-details-container">
            <h1 className="book-title">{bookDetailsData.title}</h1>
            <p className="book-prg">{bookDetailsData.authorName}</p>
            <p className="book-prg">
              Avg Rating{'  '}
              <span>
                <BsFillStarFill className="book-details-star-icon" />
              </span>{' '}
              {bookDetailsData.rating}
            </p>
            <p className="book-prg">
              Status:{' '}
              <span className="book-status">{bookDetailsData.readStatus}</span>
            </p>
          </div>
        </div>
        <hr />
        <div>
          <h1 className="content-header">About Author</h1>
          <p className="content-prg">{bookDetailsData.aboutAuthor}</p>
        </div>
        <div>
          <h1 className="content-header">About Book</h1>
          <p className="content-prg">{bookDetailsData.aboutBook}</p>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#8284C7" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getBookDetails()
  }

  renderFailureView = () => (
    <>
      <div className="top-rated-books-failure-container">
        <img
          className="top-rated-books-failure-image"
          src="https://res.cloudinary.com/dynx88ls1/image/upload/v1645337269/Group_7522_vwrftq.png"
          alt="failure view"
        />
        <p className="top-rated-books-failure-heading">
          Something Went Wrong. Please try again.
        </p>
        <button
          className="top-rated-books-failure-btn"
          onClick={this.onClickRetry}
          type="button"
        >
          Try Again
        </button>
      </div>
    </>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookDetailsStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="book-details-container">
        <Header />
        <div className="book-detail-cart">
          <h1>{this.renderViewsBasedOnAPIStatus()}</h1>
        </div>
        <Footer />
      </div>
    )
  }
}

export default BookDetails
