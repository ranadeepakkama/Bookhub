import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookie from 'js-cookie'
import './index.css'

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    history.replace('/login')
    Cookie.remove('jwt_token')
  }

  render() {
    return (
      <div className="header-container">
        <div className="img-logo">
          <Link to="/">
            <div>
              <img
                className="logo"
                src="https://res.cloudinary.com/dwtsapuyn/image/upload/v1645077666/book-hub-logo_dy4szt.png"
                alt="website logo"
              />
            </div>
          </Link>
        </div>
        <div>
          <ul className="header-list">
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="/shelf">
              <li>Bookshelves</li>
            </Link>

            <li>
              <button
                type="button"
                className="logout-butn"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
