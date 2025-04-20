import {FaStar} from 'react-icons/fa'
import {IoLocationSharp, IoBagSharp} from 'react-icons/io5'
import './index.css'

const SimilarJobs = props => {
  const {jobs} = props

  return (
    <li className="similar-jobs-card">
      <div className="logo-container">
        <img
          src={jobs.companyLogoUrl}
          alt="similar job company logo"
          className="similar-jobs-img"
        />
        <div>
          <h1 className="similar-jobs-title">{jobs.title}</h1>
          <FaStar className="rating-star" />
        </div>
      </div>
      <h1 className="description-heading">Description</h1>
      <p className="description">{jobs.jobDescription}</p>
      <div className="similar-jobs-footer">
        <div className="location-container">
          <IoLocationSharp />
          <p>{jobs.location}</p>
        </div>
        <div className="job-type-container">
          <IoBagSharp />
          <p>{jobs.employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
