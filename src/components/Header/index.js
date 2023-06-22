import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo-img"
        />
      </Link>
      <ul className="head-cont">
        <li className="name">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="name">
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
        <li>l</li>
      </ul>
      <button type="button" onClick={onClickLogout} className="logout-btn">
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
