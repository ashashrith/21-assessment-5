import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

class JobsRoute extends Component {
  state = {
    profileDetails: {},
    isLoading: true,
    profileSuccess: true,
    jobsList: [],
    loadingJobs: true,
    jobDetailsSuccess: true,
    employType: '',
    salary: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getJobsList = async () => {
    const {employType, salary, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employType}&minimum_package=${salary}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const repo = await fetch(url, options)
    if (repo.ok) {
      const fetchedData = await repo.json()
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
    if (repo.ok !== true) {
      this.setState({jobDetailsSuccess: false, loadingJobs: false})
    }
  }

  renderJobs = () => {
    const {jobsList} = this.state

    if (jobsList.length <= 0) {
      return (
        <div className="job-cont">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1 className="fail-head">No Jobs Found</h1>
          <p className="fail-p">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
    return (
      <ul className="job-list">
        {jobsList.map(each => (
          <li key={each.id} className="job-list-item">
            <Link to={`/jobs/${each.id}`} className="link">
              <div className="first">
                <img
                  src={each.companyLogoUrl}
                  alt="company logo"
                  className="com-img"
                />
                <div>
                  <h1 className="title">{each.title}</h1>
                  <p className="rating">{each.rating}</p>
                </div>
              </div>
              <div className="second">
                <div className="third">
                  <p className="location">{each.location}</p>
                  <p className="location">{each.employmentType}</p>
                </div>
                <p className="package">{each.packagePerAnnum}</p>
              </div>
              <hr className="hr-line" />
              <h1 className="des">Description</h1>
              <p className="para">{each.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsDetails = () => {
    const {jobDetailsSuccess} = this.state

    return (
      <>
        {jobDetailsSuccess ? (
          this.renderJobs()
        ) : (
          <div className="job-cont">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="fail-img"
            />
            <h1 className="fail-head">Oops! Something Went Wrong</h1>
            <p className="fail-p">
              We cannot seem to find the page you are looking for
            </p>
            <button
              className="fail-btn"
              type="button"
              onClick={this.jobsFailButton}
            >
              Retry
            </button>
          </div>
        )}
      </>
    )
  }

  jobsFailButton = () => {
    this.getJobsList()
    this.setState({searchInput: '', employType: '', salary: ''})
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
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: formattedData,
        isLoading: false,
        profileSuccess: true,
      })
    }
    if (response.ok !== true) {
      this.setState({profileSuccess: false, isLoading: false})
    }
  }

  onClickRetry = () => {
    this.getProfileDetails()
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
              alt="profile"
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

  onClickEmployFilter = event => {
    this.setState(
      prevState => ({
        employType: prevState.employType + event.target.value,
      }),
      this.getJobsList,
    )
  }

  onClickSalaryFilter = event => {
    this.setState({salary: event.target.value}, this.getJobsList)
  }

  onClickSearchButton = () => {
    const {searchInput, jobsList} = this.state
    const filterSearchList = jobsList.filter(each =>
      each.title.toLowerCase().includes(searchInput.toLowerCase()),
    )
    this.setState({jobsList: filterSearchList}, this.getJobsList)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  render() {
    const {isLoading, loadingJobs, searchInput} = this.state

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
                <input
                  className="checkbox"
                  id="full"
                  type="checkbox"
                  name="checkbox"
                  value="FULLTIME"
                  onClick={this.onClickEmployFilter}
                />
                Full Time
              </label>
              <label htmlFor="part" className="label">
                <input
                  className="checkbox"
                  id="part"
                  type="checkbox"
                  name="checkbox"
                  value="PARTTIME"
                  onClick={this.onClickEmployFilter}
                />
                Part Time
              </label>
              <label htmlFor="free" className="label">
                <input
                  className="checkbox"
                  id="free"
                  type="checkbox"
                  name="checkbox"
                  value="FREELANCE"
                  onClick={this.onClickEmployFilter}
                />
                Freelance
              </label>
              <label htmlFor="int" className="label">
                <input
                  className="checkbox"
                  id="int"
                  type="checkbox"
                  name="checkbox"
                  value="INTERNSHIP"
                  onClick={this.onClickEmployFilter}
                />
                Internship
              </label>
            </ul>
            <hr className="line" />
            <ul className="salary-cont">
              <h1 className="heading">Salary Range</h1>
              <label htmlFor="10" className="label">
                <input
                  className="checkbox"
                  id="10"
                  type="radio"
                  name="salary"
                  onClick={this.onClickSalaryFilter}
                  value="1000000"
                />
                10 LPA and above
              </label>
              <label htmlFor="20" className="label">
                <input
                  className="checkbox"
                  id="20"
                  type="radio"
                  name="salary"
                  onClick={this.onClickSalaryFilter}
                  value="2000000"
                />
                20 LPA and above
              </label>
              <label htmlFor="30" className="label">
                <input
                  className="checkbox"
                  id="30"
                  type="radio"
                  name="salary"
                  onClick={this.onClickSalaryFilter}
                  value="3000000"
                />
                30 LPA and above
              </label>
              <label htmlFor="40" className="label">
                <input
                  className="checkbox"
                  id="40"
                  type="radio"
                  name="salary"
                  onClick={this.onClickSalaryFilter}
                  value="4000000"
                />
                40 LPA and above
              </label>
            </ul>
          </div>
          <div className="search-container">
            <div className="search-cont">
              <input
                type="search"
                className="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchButton}
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
