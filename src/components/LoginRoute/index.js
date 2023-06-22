import {Component} from 'react'

import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', showErrorMsg: false, errMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({showErrorMsg: true, errMsg})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsername = () => {
    const {username} = this.state

    return (
      <>
        <label className="label" htmlFor="username">
          USERNAME
        </label>
        <input
          className="input"
          value={username}
          id="username"
          type="text"
          onChange={this.onChangeUsername}
          placeholder="USERNAME"
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state

    return (
      <>
        <label htmlFor="label" className="label">
          PASSWORD
        </label>
        <input
          className="input"
          id="label"
          value={password}
          type="password"
          onChange={this.onChangePassword}
          placeholder="PASSWORD"
        />
      </>
    )
  }

  render() {
    const {showErrorMsg, errMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form" onSubmit={this.submitForm}>
            <div className="input-container">{this.renderUsername()}</div>
            <div className="input-container">{this.renderPassword()}</div>
            <button type="submit" className="submit-btn">
              Login
            </button>
            {showErrorMsg && <p className="error-message">*{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginRoute
