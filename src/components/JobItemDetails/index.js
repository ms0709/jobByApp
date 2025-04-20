import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp, IoBagSharp} from 'react-icons/io5'
import Loader from 'react-loader-spinner'
import './index.css'
import Skills from '../Skills'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'

const renderStatusConst = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetail: [],
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
    renderStatus: renderStatusConst.loading,
  }

  componentDidMount() {
    this.getJobDetail()
  }

  getJobDetail = async () => {
    this.setState({renderStatus: renderStatusConst.loading})
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {headers: {Authorization: `Barear ${jwtToken}`}}
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const jobDetails = data.job_details
      const updatedJobDetails = {
        id: jobDetails.id,
        title: jobDetails.title,
        companyLogoUrl: jobDetails.company_logo_url,
        rating: jobDetails.rating,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        packagePerAnnum: jobDetails.package_per_annum,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
        skills: jobDetails.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
        similarJobs: data.similar_jobs.map(eachJob => ({
          id: eachJob.id,
          companyLogoUrl: eachJob.company_logo_url,
          location: eachJob.location,
          title: eachJob.title,
          employmentType: eachJob.employment_type,
          rating: eachJob.rating,
          jobDescription: eachJob.job_description,
        })),
      }

      this.setState({
        jobDetail: updatedJobDetails,
        skills: updatedJobDetails.skills,
        lifeAtCompany: updatedJobDetails.lifeAtCompany,
        similarJobs: updatedJobDetails.similarJobs,
        renderStatus: renderStatusConst.success,
      })
    } else {
      this.setState({renderStatus: renderStatusConst.failure})
    }
  }

  renderJobDetails = () => {
    const {jobDetail, skills, lifeAtCompany} = this.state
    console.log(jobDetail.lifeAtCompany)
    return (
      <div>
        <div className="job-details-content">
          <div className="jobs-logo-container">
            <img
              src={jobDetail.companyLogoUrl}
              alt="job details company logo"
              className="company-logo-img"
            />
            <div>
              <h1 className="company-name">{jobDetail.title}</h1>
              <div className="rating-container">
                <FaStar className="rating-star" />
                <p>{jobDetail.rating}</p>
              </div>
            </div>
          </div>
          <div className="salary-container">
            <div className="location-type-container">
              <div className="location-container">
                <IoLocationSharp />
                <p>{jobDetail.location}</p>
              </div>
              <div className="job-type-container">
                <IoBagSharp />
                <p>{jobDetail.employmentType}</p>
              </div>
            </div>
            <p className="salary">{jobDetail.packagePerAnnum}</p>
          </div>
          <hr className="row" />
          <div className="visit-site-container">
            <h1 className="description-heading">Description</h1>
            <a href={jobDetail.companyWebsiteUrl} className="visit-link">
              Visit <FaExternalLinkAlt />
            </a>
          </div>
          <p className="description">{jobDetail.jobDescription}</p>
          <h1 className="skill-text">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(eachSkill => (
              <Skills skill={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1 className="life-at-company-text">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company">{lifeAtCompany.description}</p>
            <img
              className="life-at-company-img"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        {this.renderSimilarJobs()}
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-job-list-container">
          {similarJobs.map(eachJob => (
            <SimilarJobs jobs={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getJobDetail()
  }

  renderFailureView = () => (
    <div className="failure-img-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-text">Oops! Something Went Wrong</h1>
      <p className="failure-text-about">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  render() {
    const {renderStatus} = this.state
    switch (renderStatus) {
      case renderStatusConst.loading:
        return (
          <div>
            <Header />
            <div className="job-details-bg">{this.renderLoaderView()}</div>
          </div>
        )
      case renderStatusConst.success:
        return (
          <div>
            <Header />
            <div className="job-details-bg">{this.renderJobDetails()}</div>
          </div>
        )
      case renderStatusConst.failure:
        return (
          <div>
            <Header />
            <div className="job-details-bg">{this.renderFailureView()}</div>
          </div>
        )
      default:
        return null
    }
  }
}
export default JobItemDetails
