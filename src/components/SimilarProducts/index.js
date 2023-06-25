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
    id,
  } = item

  return (
    <li className="pro-cont" key={id}>
      <div className="first">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="img"
        />
        <h1 className="heading">{title}</h1>
        <p className="rating">{rating}</p>
      </div>
      <h1 className="heading">Description</h1>
      <p className="para">{jobDescription}</p>
      <div className="second">
        <p className="location">{location}</p>
        <p className="location">{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarProducts
