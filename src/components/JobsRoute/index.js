import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobItemDetailsRoute from '../JobItemDetailsRoute'

import './index.css'

class JobsRoute extends Component {
  state = {
    profileDetails: {},
    isLoading: true,
    profileSuccess: true,
    jobsList: [],
    loadingJobs: true,
    jobDetailsSuccess: true,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getJobsList = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/jobs'
    const options = {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        loadingJobs: false,
        jobDetailsSuccess: true,
      })
    }
    if (response.ok !== true) {
      this.setState({jobDetailsSuccess: false, loadingJobs: false})
    }
  }

  renderJobsDetails = () => {
    const {jobDetailsSuccess, jobsList} = this.state

    return (
      <>
        {jobDetailsSuccess ? (
          <ul className="job-list">
            {jobsList.map(each => (
              <JobItemDetailsRoute job={each} key={each.id} />
            ))}
          </ul>
        ) : (
          <div className="job-cont">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="fail-img"
            />
            <h1 className="fail-head">Oops! Something Went Wrong</h1>
            <p className="fail-p">
              We cannot seem to find the page your looking for.
            </p>
            <button
              className="fail-btn"
              type="button"
              onClick={this.failButton}
            >
              Retry
            </button>
          </div>
        )}
      </>
    )
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = data.profile_details.map(eachProfile => ({
        name: eachProfile.name,
        profileImageUrl: eachProfile.profile_image_url,
        shortBio: eachProfile.short_bio,
      }))
      this.setState({
        profileDetails: formattedData,
        isLoading: false,
        profileSuccess: true,
      })
    }
    if (response.ok !== true) {
      this.setState({profileSuccess: false, isLoading: true})
    }
  }

  onClickRetry = () => {
    this.getJobsList()
  }

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4f46e5" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileSuccess, profileDetails} = this.state

    return (
      <>
        {profileSuccess ? (
          <div className="profile-cont">
            <img
              src={profileDetails.profileImageUrl}
              alt={profileDetails.name}
              className="profile-img"
            />
            <h1 className="pro-heading">{profileDetails.name}</h1>
            <p className="pro-bio">{profileDetails.shortBio}</p>
          </div>
        ) : (
          <div className="profile-fail">
            <button
              type="button"
              onClick={this.onClickRetry}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        )}
      </>
    )
  }

  render() {
    const {profileDetails, isLoading, loadingJobs} = this.state
    console.log(profileDetails)

    return (
      <>
        <Header />
        <div className="job-container">
          <div className="profile-container">
            <div className="profile">
              {isLoading ? this.renderLoader() : this.renderProfile()}
            </div>
            <hr className="line" />
            <ul className="type-employ">
              <h1 className="heading">Type of Employment</h1>
              <label htmlFor="full" className="label">
                <input className="checkbox" id="full" type="checkbox" />
                Full Time
              </label>
              <label htmlFor="part" className="label">
                <input className="checkbox" id="part" type="checkbox" />
                Part Time
              </label>
              <label htmlFor="free" className="label">
                <input className="checkbox" id="free" type="checkbox" />
                Freelance
              </label>
              <label htmlFor="int" className="label">
                <input className="checkbox" id="int" type="checkbox" />
                Internship
              </label>
            </ul>
            <hr className="line" />
            <ul className="salary-cont">
              <h1 className="heading">Salary Range</h1>
              <label htmlFor="10" className="label">
                <input className="checkbox" id="10" type="radio" />
                10 LPA and above
              </label>
              <label htmlFor="20" className="label">
                <input className="checkbox" id="20" type="radio" />
                20 LPA and above
              </label>
              <label htmlFor="30" className="label">
                <input className="checkbox" id="30" type="radio" />
                30 LPA and above
              </label>
              <label htmlFor="40" className="label">
                <input className="checkbox" id="40" type="radio" />
                40 LPA and above
              </label>
            </ul>
          </div>
          <div className="search-container">
            <div className="search-cont">
              <input type="search" className="search" placeholder="Search" />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {loadingJobs ? this.renderLoader() : this.renderJobsDetails()}
          </div>
        </div>
      </>
    )
  }
}

export default JobsRoute
