import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const topRatedApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  autoplay: true,
  slidesToScroll: 1,
  slidesToShow: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 786,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {apiStatus: topRatedApiStatuses.initial, topRatedBooks: []}

  componentDidMount() {
    this.getBookResponse()
  }

  getBookResponse = async () => {
    this.setState({apiStatus: topRatedApiStatuses.inProgress})

    const topRatedBookApi = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const jwtToken = Cookie.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(topRatedBookApi, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const booksList = fetchedData.books
      const updatedData = booksList.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      this.setState({
        apiStatus: topRatedApiStatuses.success,
        topRatedBooks: updatedData,
      })
    } else {
      this.setState({apiStatus: topRatedApiStatuses.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#8284C7" height={50} width={50} />
    </div>
  )

  renderTopRatedBooks = () => {
    const {topRatedBooks} = this.state

    const onClickGetBookDetails = id => {
      const {history} = this.props
      history.push(`/books/${id}`)
    }

    return (
      <>
        <div className="book-cart-header">
          <h1>Top Rated Books</h1>
          <button
            type="button"
            onClick={this.onClickFindBooks}
            className="find-butn"
          >
            Find Books
          </button>
        </div>
        <div className="book-details">
          <Slider {...settings}>
            {topRatedBooks.map(eachBook => (
              <button
                type="button"
                className="book-butn"
                onClick={() => onClickGetBookDetails(eachBook.id)}
                key={eachBook.id}
              >
                <div className="eachBook-detail">
                  <img
                    className="book-img"
                    src={eachBook.coverPic}
                    alt={eachBook.title} // Ensure the alt attribute is correctly set
                  />
                  <div className="auth-title">
                    <h1 className="book-header">{eachBook.title}</h1>
                    <p className="book-prg">{eachBook.authorName}</p>
                  </div>
                </div>
              </button>
            ))}
          </Slider>
        </div>
      </>
    )
  }

  onClickRetry = () => {
    this.getBookResponse()
  }

  renderFailureView = () => (
    <div>
      <div className="failure-details">
        <img
          src="https://res.cloudinary.com/dw8uscrww/image/upload/v1721039050/Group_7522_cob7nu.png"
          alt="failure view"
        />
        <p className="top-rated-books-failure-heading">
          Something Went wrong. Please try again.
        </p>
        <button className="find-butn" onClick={this.onClickRetry} type="button">
          Try Again
        </button>
      </div>
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case topRatedApiStatuses.success:
        return this.renderTopRatedBooks()
      case topRatedApiStatuses.failure:
        return this.renderFailureView()
      case topRatedApiStatuses.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onClickFindBooks = () => {
    const {history} = this.props
    history.replace('/shelf')
  }

  render() {
    return (
      <div className="home-main-container">
        <Header />
        <div className="home-container">
          <h1 className="main-header">Find Your Next Favorite Books?</h1>
          <p className="prg">
            You are in the right place. Tell us what titles or genres you have
            enjoyed in the past, and we will give you surprisingly insightful
            recommendations.
          </p>
          <div className="book-cart">
            <>{this.renderViewsBasedOnAPIStatus()}</>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default Home
