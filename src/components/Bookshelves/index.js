import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import BookItem from '../BookItem'
import Footer from '../Footer'

import './index.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Bookshelves extends Component {
  state = {
    searchInput: '',
    activeFilter: bookshelvesList[0].value,
    search: '',
    bookData: {},
    apiStatus: apiStatusConstants.initial,
    label: bookshelvesList[0].label,
  }

  componentDidMount() {
    this.getBooksApiData()
  }

  updatedBooksList = bookList =>
    bookList.map(eachItem => ({
      id: eachItem.id,
      authorName: eachItem.author_name,
      coverPic: eachItem.cover_pic,
      rating: eachItem.rating,
      readStatus: eachItem.read_status,
      title: eachItem.title,
    }))

  getBooksApiData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {search, activeFilter} = this.state
    const booksApi = `https://apis.ccbp.in/book-hub/books?shelf=${activeFilter}&search=${search}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(booksApi, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        books: this.updatedBooksList(data.books),
        total: data.total,
      }
      this.setState({
        bookData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeInput = e => {
    this.setState({searchInput: e.target.value})
  }

  onSearchBooks = () => {
    this.setState(
      pvrState => ({search: pvrState.searchInput}),
      this.getBooksApiData,
    )
  }

  renderTheListOfBooks = () => {
    const {bookData} = this.state
    const {books} = bookData
    return (
      <>
        <ul className="unorder-list-books">
          {books.map(eachItem => (
            <BookItem key={eachItem.id} eachItem={eachItem} />
          ))}
        </ul>
      </>
    )
  }

  renderNoMatchBooks = () => {
    const {searchInput} = this.state
    return (
      <div className="no-match-found-container">
        <img
          className="no-match-img"
          src="https://res.cloudinary.com/dw8uscrww/image/upload/v1721220173/Asset_1_1_i2wqyd.png"
          alt="no books"
        />
        <p className="no-match-paragraph">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  onClickRetry = () => {
    this.getBooksApiData()
  }

  renderAllBookView = () => {
    const {bookData} = this.state
    const count = bookData.total
    if (count !== 0) {
      return <>{this.renderTheListOfBooks()}</>
    }
    return <>{this.renderNoMatchBooks()}</>
  }

  renderLoadingView = () => (
    <div className="loading-view" testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        className="top-rated-books-failure-image"
        src="https://res.cloudinary.com/dkxxgpzd8/image/upload/v1647250727/Screenshot_30_uavmge.png"
        alt="failure view"
      />
      <p className="top-rated-books-failure-heading">
        Something went wrong. Please try Again.
      </p>
      <button
        className="top-rated-books-failure-btn"
        onClick={this.onClickRetry}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAllBookView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onClickSelectOption = eachItem => {
    this.setState({activeFilter: eachItem.value, label: eachItem.label}, () =>
      this.getBooksApiData(),
    )
  }

  render() {
    const {searchInput, activeFilter, label} = this.state
    return (
      <>
        <Header />
        <div className="bookshelf-container">
          <div className="bookshelf-options">
            <h1 className="bookshelf-header" key="title">
              Bookshelves
            </h1>
            <ul className="un-order-list-options">
              {bookshelvesList.map(eachItem => {
                const activeFilterClass =
                  activeFilter === eachItem.value ? 'active-filter-lg' : ''
                return (
                  <li className="list-option" key={eachItem.value}>
                    <button
                      type="button"
                      className={`option-butn ${activeFilterClass}`}
                      onClick={() => this.onClickSelectOption(eachItem)}
                    >
                      {eachItem.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="all-books-container">
            <div className="header-find-container">
              <h1 className="allBook-header">{label} Books</h1>
              <div className="search-input-container">
                <input
                  placeholder="Search...."
                  type="search"
                  className="search-input"
                  onChange={this.onChangeInput}
                  value={searchInput}
                />
                <button
                  className="search-btn"
                  onClick={this.onSearchBooks}
                  type="button"
                  testid="searchButton"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            <div className="allBooks-container">
              {this.renderViewsBasedOnAPIStatus()}
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Bookshelves
