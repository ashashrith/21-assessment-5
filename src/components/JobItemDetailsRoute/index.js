import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProduct from '../SimilarProducts'
import './index.css'

class JobItemDetailsRoute extends Component {
  state = {
    isLoading: true,
    itemDetails: {},
    similarList: [],
    pageErr: false,
    skillsList: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompanyDescription: data.job_details.life_at_company.description,
        lifeAtCompanyImage: data.job_details.life_at_company.image_url,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      const skills = data.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const similarProducts = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        itemDetails: updatedData,
        similarList: similarProducts,
        isLoading: false,
        pageErr: false,
        skillsList: skills,
      })
    }
    if (response.ok !== true) {
      this.setState({pageErr: true, isLoading: false})
    }
  }

  renderItemDetails = () => {
    const {pageErr, itemDetails, similarList, skillsList} = this.state

    return (
      <>
        {!pageErr ? (
          <div className="final">
            <div className="job-item-cont">
              <div className="first">
                <img
                  src={itemDetails.companyLogoUrl}
                  alt="job details company logo"
                  className="com-logo"
                />
                <div className="second">
                  <h1 className="title">{itemDetails.title}</h1>
                  <p className="rating">{itemDetails.rating}</p>
                </div>
              </div>
              <div className="third">
                <div className="fourth">
                  <p className="location">{itemDetails.location}</p>
                  <p className="location">{itemDetails.employmentType}</p>
                </div>
                <p className="salary">{itemDetails.packagePerAnnum}</p>
              </div>
              <hr className="line" />
              <div className="fifth">
                <h1 className="des">Description</h1>
                <a href={itemDetails.companyWebsiteUrl} className="visit">
                  Visit
                </a>
              </div>
              <p className="para">{itemDetails.jobDescription}</p>
              <h1 className="des">Skills</h1>
              <ul className="skill-cont">
                {skillsList.map(each => (
                  <li className="skill-item">
                    <img
                      src={each.imageUrl}
                      alt={each.name}
                      className="skill-img"
                    />
                    <p className="name">{each.name}</p>
                  </li>
                ))}
              </ul>
              <h1 className="des">Life at Company</h1>
              <div className="sixth">
                <p className="para">{itemDetails.lifeAtCompanyDescription}</p>
                <img
                  src={itemDetails.lifeAtCompanyImage}
                  alt="life at company"
                  className="image"
                />
              </div>
            </div>
            <h1 className="des">Similar Jobs</h1>
            <ul className="sim-list-cont">
              {similarList.map(each => (
                <SimilarProduct item={each} key={each.id} />
              ))}
            </ul>
          </div>
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
              onClick={this.itemFailButton}
            >
              Retry
            </button>
          </div>
        )}
      </>
    )
  }

  itemFailButton = () => {
    this.getJobItemDetails()
  }

  render() {
    const {isLoading} = this.state

    return (
      <>
        <Header />
        <div className="item-cont">
          {isLoading ? (
            <div
              className="products-details-loader-container"
              data-testid="loader"
            >
              <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
            </div>
          ) : (
            this.renderItemDetails()
          )}
        </div>
      </>
    )
  }
}

export default JobItemDetailsRoute
