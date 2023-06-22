import './index.css'

const ProfileItemDetails = props => {
  const {item} = props
  const {name, profileImageUrl, shortBio} = item

  return (
    <li className="list">
      <img src={profileImageUrl} alt={name} className="profile-img" />
      <h1 className="pro-heading">{name}</h1>
      <p className="pro-bio">{shortBio}</p>
    </li>
  )
}

export default ProfileItemDetails
