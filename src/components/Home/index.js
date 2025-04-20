import Header from '../Header'
import './index.css'

const Home = props => {
  const onFindJobs = () => {
    const {history} = props
    history.push('/jobs')
  }
  return (
    <div className="home-bg-container">
      <Header />
      <div className="home-content">
        <h1 className="heading">
          Find The Job That Fits Your Life
          <br />
        </h1>
        <p className="about">
          Millions of people are searching for jobs, salary Information, company
          reviews. Find the job that fits your abilities and potential.
        </p>

        <button type="button" className="find-job-btn" onClick={onFindJobs}>
          Find Jobs
        </button>
      </div>
    </div>
  )
}

export default Home
