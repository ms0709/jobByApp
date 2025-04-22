import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const renderProfileStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Profile extends Component {
  state = {profileDetail: {}, renderStatus: renderProfileStatus.loading}

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({renderStatus: renderProfileStatus.loading})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Barear ${jwtToken}`},
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetail: updatedDetails,
        renderStatus: renderProfileStatus.success,
      })
    } else {
      this.setState({renderStatus: renderProfileStatus.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileDetail} = this.state
    return (
      <div className="profile-container">
        <img src={profileDetail.profileImageUrl} alt="profile" />
        <h1 className="profile-name">{profileDetail.name}</h1>
        <p className="profile-bio">{profileDetail.shortBio}</p>
      </div>
    )
  }

  onClickRetry = () => {
    this.getProfileDetails()
  }

  failureView = () => (
    <button type="button" className="retry-btn" onClick={this.onClickRetry}>
      Retry
    </button>
  )

  renderViews = () => {
    const {renderStatus} = this.state
    switch (renderStatus) {
      case renderProfileStatus.loading:
        return this.renderLoader()
      case renderProfileStatus.success:
        return this.renderProfile()
      case renderProfileStatus.failure:
        return this.failureView()

      default:
        return null
    }
  }

  render() {
    return <div className="profile-bg-container">{this.renderViews()}</div>
  }
}

export default Profile
