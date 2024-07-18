import {withRouter, Link} from 'react-router-dom'
import './index.css'

const NotFound = props => {
  const navigateToHomePage = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="container">
      <div className="img-notfound-container">
        <img
          className="notfound-img"
          src="https://res.cloudinary.com/dw8uscrww/image/upload/v1720756749/Group_7484_sqw9zk.png"
          alt="not found"
        />
      </div>
      <div className="detail-container">
        <h1>Page Not Found</h1>
        <p>
          we are sorry, the page you requested could not be found,Please go back
          to the homepage
        </p>
        <Link to="/">
          <button type="button" onClick={navigateToHomePage} className="butn">
            Go Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}

export default withRouter(NotFound)
