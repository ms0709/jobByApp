import {BsSearch} from 'react-icons/bs'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import JobItem from '../JobItem'
import Header from '../Header'
import Profile from '../Profile'
import EmploymentType from '../EmploymentType'
import SalaryRange from '../SalaryRange'

import './index.css'

const renderJobsStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noDataFound: 'NO-DATA-FOUND',
}

const locationList = [
  {id: 1, location: 'Hyderabad'},
  {id: 2, location: 'Bangalore'},
  {id: 3, location: 'Chennai'},
  {id: 4, location: 'Delhi'},
  {id: 5, location: 'Mumbai'},
]

class Jobs extends Component {
  state = {
    jobsList: [],
    employmentTypeChangeList: [],
    minimumPackage: '',
    searchValue: '',
    renderStatus: renderJobsStatus.loading,
    selectedLocation: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const {employmentTypeChangeList, minimumPackage} = this.state
    const employmentTypeValue = employmentTypeChangeList.join(',')
    this.setState({renderStatus: renderJobsStatus.loading})
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeValue}&minimum_package=${minimumPackage}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Barear ${jwtToken}`},
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobs = data.jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        rating: eachJob.rating,
        companyLogoUrl: eachJob.company_logo_url,
        location: eachJob.location,
        jobDescription: eachJob.job_description,
        employmentType: eachJob.employment_type,
        packagePerAnnum: eachJob.package_per_annum,
      }))
      this.setState({
        jobsList: updatedJobs,
        renderStatus: renderJobsStatus.success,
      })
    } else {
      this.setState({renderStatus: renderJobsStatus.failure})
    }
  }

  changeEmploymentType = empType => {
    // console.log(empType)
    this.setState(prevState => {
      if (prevState.employmentTypeChangeList.includes(empType)) {
        return {
          employmentTypeChangeList: prevState.employmentTypeChangeList.filter(
            eachType => eachType !== empType,
          ),
        }
      }

      return {
        employmentTypeChangeList: [
          ...prevState.employmentTypeChangeList,
          empType,
        ],
      }
    }, this.getJobs)
  }

  changeSalaryRange = salaryRange => {
    this.setState({minimumPackage: salaryRange}, this.getJobs)
  }

  onChangeSearchValue = event => {
    this.setState({searchValue: event.target.value})
  }

  filteredJobs = value => {
    const {jobsList} = this.state
    const filteredJobs = jobsList.filter(eachJob =>
      eachJob.title.toLowerCase().includes(value.toLowerCase()),
    )
    return filteredJobs
  }

  onClickSearch = () => {
    const {searchValue} = this.state
    const filteredJob = this.filteredJobs(searchValue)
    if (filteredJob.length === 0) {
      this.setState({renderStatus: renderJobsStatus.noDataFound})
    } else {
      this.setState({
        jobsList: filteredJob,
        renderStatus: renderJobsStatus.success,
      })
    }
  }

  onClickRetry = () => {
    this.getJobs()
  }

  onLocation = event => {
    const {checked, value} = event.target

    this.setState(prevState => {
      if (checked) {
        return {
          selectedLocation: [...prevState.selectedLocation, value],
        }
      }
      return {
        selectedLocation: prevState.selectedLocation.filter(
          eachLocation => eachLocation !== value,
        ),
      }
    })
  }

  getFilteredData = () => {
    const {jobsList, selectedLocation} = this.state
    if (selectedLocation.length === 0) {
      return jobsList
    }
    const locationFilter = jobsList.filter(eachJob =>
      selectedLocation.includes(eachJob.location),
    )
    return locationFilter
  }

  renderSuccessView = () => {
    const locationFilter = this.getFilteredData()
    return (
      <ul className="jobs-list-container">
        {locationFilter.map(eachJob => (
          <JobItem jobs={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
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

  renderNoDataFoundView = () => (
    <div className="failure-img-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="failure-img"
      />
      <h1 className="failure-text">No Jobs Found</h1>
      <p className="failure-text-about">
        We cannot find any jobs. Try another filters.
      </p>
    </div>
  )

  renderLoadingView = () => (
    <div className="failure-img-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderView = () => {
    const {renderStatus} = this.state

    switch (renderStatus) {
      case renderJobsStatus.loading:
        return this.renderLoadingView()
      case renderJobsStatus.success:
        return this.renderSuccessView()
      case renderJobsStatus.failure:
        return this.renderFailureView()
      case renderJobsStatus.noDataFound:
        return this.renderNoDataFoundView()
      default:
        return null
    }
  }

  render() {
    const {searchValue, location} = this.state
    const {employmentTypesList, salaryRangesList} = this.props
    console.log(location)
    return (
      <div className="bg-container">
        <Header />
        <div className="jobs-bg-container">
          <div className="jobs-profile-options-container">
            <Profile /> <hr className="row" />
            <ul className="employment-type-list-container">
              <li>
                <h1 className="employment-type-text">Employment Type</h1>
              </li>
              {employmentTypesList.map(eachType => (
                <EmploymentType
                  employmentType={eachType}
                  key={eachType.employmentTypeId}
                  changeEmploymentType={this.changeEmploymentType}
                />
              ))}
            </ul>
            <hr className="row" />
            <ul className="salary-range-list-container">
              <li>
                <h1 className="salary-type-text">Salary Range</h1>
              </li>
              {salaryRangesList.map(eachRange => (
                <SalaryRange
                  salaryRange={eachRange}
                  key={eachRange.salaryRangeId}
                  changeSalaryRange={this.changeSalaryRange}
                />
              ))}
            </ul>
            <hr className="row" />
            <ul className="location-container">
              <li>
                <h1 className="salary-type-text">Location</h1>
              </li>
              {locationList.map(eachLocation => (
                <li key={eachLocation.id} className="location-item">
                  <input
                    type="checkbox"
                    id={eachLocation.id}
                    className="employement-type-checkbox"
                    onChange={this.onLocation}
                    value={eachLocation.location}
                  />
                  <label
                    htmlFor={eachLocation.id}
                    className="employement-type-label"
                  >
                    {eachLocation.location}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="job-content-container">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchValue}
                onChange={this.onChangeSearchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderView()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
