import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeName = e => {
    this.setState({username: e.target.value})
  }

  onChangePasswd = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccuss = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async e => {
    const {username, password} = this.state
    e.preventDefault()
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccuss(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username">Username*</label>
        <br />
        <input
          id="username"
          type="text"
          placeholder="Username"
          onChange={this.onChangeName}
          value={username}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password">Password*</label>
        <br />
        <input
          type="password"
          id="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={this.onChangePasswd}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-container">
        <div className="img-container">
          <img
            src="https://res.cloudinary.com/dw8uscrww/image/upload/v1720625683/e7efb0d3d71dcb5062f1e077527d7f5d_tr0h0j.jpg"
            alt="login website logo"
            className="login-website-logo"
          />
        </div>
        <div className="form-container">
          <form className="form" onSubmit={this.onSubmitForm}>
            <>
              <img
                className="logo"
                src="https://res.cloudinary.com/dwtsapuyn/image/upload/v1645077666/book-hub-logo_dy4szt.png"
                alt="website login"
              />
            </>

            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>

            <div className="butn-container">
              <button className="butn" type="submit">
                Login
              </button>
            </div>
            {showSubmitError && <p className="error-message">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
