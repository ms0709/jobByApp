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

class Jobs extends Component {
  state = {
    jobsList: [],
    employmentTypeChangeList: [],
    minimumPackage: '',
    searchValue: '',
    renderStatus: renderJobsStatus.loading,
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
    console.log(empType)
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

  renderSuccessView = () => {
    const {jobsList, searchValue} = this.state
    const {employmentTypesList, salaryRangesList} = this.props
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
            <ul className="jobs-list-container">
              {jobsList.map(eachJob => (
                <JobItem jobs={eachJob} key={eachJob.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderFailureView = () => {
    const {searchValue} = this.state
    const {employmentTypesList, salaryRangesList} = this.props
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
              <button
                type="button"
                className="retry-btn"
                onClick={this.onClickRetry}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderNoDataFoundView = () => {
    const {searchValue} = this.state
    const {employmentTypesList, salaryRangesList} = this.props
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
          </div>
        </div>
      </div>
    )
  }

  renderLoadingView = () => {
    const {searchValue} = this.state
    const {employmentTypesList, salaryRangesList} = this.props
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
            <div className="failure-img-container">
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {renderStatus} = this.state

    switch (renderStatus) {
      case renderJobsStatus.loading:
        return <div className="bg-container">{this.renderLoadingView()}</div>
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
}
export default Jobs
