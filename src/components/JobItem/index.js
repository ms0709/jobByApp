import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp, IoBagSharp} from 'react-icons/io5'

import './index.css'

const JobItem = props => {
  const {jobs} = props
  return (
    <li>
      <Link to={`/jobs/${jobs.id}`} className="jobs-link">
        <div className="jobs-card">
          <div className="logo-container">
            <img
              src={jobs.companyLogoUrl}
              alt="company logo"
              className="company-logo-img"
            />
            <div>
              <h1 className="company-name">{jobs.title}</h1>
              <div className="rating-container">
                <FaStar className="rating-star" />
                <p>{jobs.rating}</p>
              </div>
            </div>
          </div>
          <div className="salary-container">
            <div className="location-type-container">
              <div className="location-container">
                <IoLocationSharp />
                <p>{jobs.location}</p>
              </div>
              <div className="job-type-container">
                <IoBagSharp />
                <p>{jobs.employmentType}</p>
              </div>
            </div>
            <p className="salary">{jobs.packagePerAnnum}</p>
          </div>
          <hr className="row" />
          <h1 className="description-heading">Description</h1>
          <p className="description">{jobs.jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
