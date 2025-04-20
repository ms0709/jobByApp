import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorMsg: '', isError: false}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  // onSubmitFailure = errorMsg => {
  //   this.setState({errorMsg: errorMsg, isError: true})
  // }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {method: 'POST', body: JSON.stringify(userDetails)}
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  usernameFormField = () => {
    const {username} = this.state
    return (
      <div>
        <label htmlFor="username">USERNAME</label>
        <br />
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          value={username}
          id="username"
          onChange={this.onChangeUsername}
        />
      </div>
    )
  }

  passwordFormField = () => {
    const {password} = this.state
    return (
      <div>
        <label htmlFor="password">PASSWORD</label>
        <br />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          id="password"
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {errorMsg, isError} = this.state
    return (
      <div className="login-bg-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            className="form-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          {this.usernameFormField()}
          {this.passwordFormField()}
          <button type="submit" className="login-btn">
            Login
          </button>
          {isError ? <p className="error-msg">*{errorMsg}</p> : ''}
        </form>
      </div>
    )
  }
}
export default LoginForm
