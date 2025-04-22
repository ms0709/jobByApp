import {Link, withRouter} from 'react-router-dom'
import {IoBagSharp} from 'react-icons/io5'
import Cookies from 'js-cookie'
import {MdHome} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  const largeScreen = () => (
    <div className="large-screen-nav nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo-img"
        />
      </Link>
      <ul className="nav-link-container">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
      </ul>

      <button type="button" className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  )

  const smallerScreen = () => (
    <div className="small-screen-nav nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo-img"
        />
      </Link>
      <ul className="nav-link-container">
        <li>
          <Link to="/" className="nav-link">
            <MdHome size={27} color="#ffffff" />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            <IoBagSharp size={25} color="#ffffff" />
          </Link>
        </li>
      </ul>

      <button
        type="button"
        className="small-screen-logout-btn"
        onClick={onLogout}
      >
        <FiLogOut color="#ffffff" size={25} />
      </button>
    </div>
  )

  return (
    <div>
      {largeScreen()}
      {smallerScreen()}
    </div>
  )
}

export default withRouter(Header)
