import './index.css'

const SimilarProducts = props => {
  const {item} = props
  const {
    companyLogoUrl,
    title,
    rating,
    employmentType,
    location,
    jobDescription,
  } = item

  return (
    <div className="pro-cont">
      <div className="first">
        <img src={companyLogoUrl} alt="company logo" className="img" />
        <h1 className="heading">{title}</h1>
        <p className="rating">{rating}</p>
      </div>
      <h1 className="heading">Description</h1>
      <p className="para">{jobDescription}</p>
      <div className="second">
        <p className="location">{location}</p>
        <p className="location">{employmentType}</p>
      </div>
    </div>
  )
}

export default SimilarProducts
