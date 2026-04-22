import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { uploadImg } from '../../services/imgUpload.service'
import { updateUser } from '../../store/actions/userActions'

const fieldLimits = {
  fullname: 50,
  additionalName: 50,
  headline: 220,
  bio: 500,
  address: 120,
  website: 150,
  phone: 40,
  bg: 280,
}

const normalizeWebsite = (value) => {
  const trimmedValue = value.trim()
  if (!trimmedValue) return ''
  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue
  return `https://${trimmedValue}`
}

export function EditModal({ toggleShowEditModal, user }) {
  const dispatch = useDispatch()
  const [errorMsg, setErrorMsg] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingBackground, setIsUploadingBackground] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState({
    _id: user._id,
    fullname: user.fullname || '',
    additionalName: user.additionalName || '',
    headline: user.headline || user.profession || '',
    bio: user.bio || '',
    address: user.address || '',
    website: user.website || '',
    phone: user.phone || '',
    bg: user.bg || '',
    imgUrl: user.imgUrl || '',
    profession: user.profession || user.headline || '',
  })

  const firstNamePlaceholder = useMemo(() => {
    return userToUpdate.fullname?.split(' ')?.[0] || ''
  }, [userToUpdate.fullname])

  const handleChange = ({ target }) => {
    const { name, value } = target
    const limitedValue = fieldLimits[name]
      ? value.slice(0, fieldLimits[name])
      : value

    setUserToUpdate((prevState) => ({
      ...prevState,
      [name]: limitedValue,
      profession:
        name === 'headline' ? limitedValue : prevState.headline || prevState.profession,
    }))

    if (errorMsg) setErrorMsg('')
  }

  const onUploadAvatar = async (ev) => {
    try {
      setIsUploadingAvatar(true)
      setErrorMsg('')
      const res = await uploadImg(ev)
      setUserToUpdate((prevState) => ({
        ...prevState,
        imgUrl: res.url,
      }))
    } catch (err) {
      console.error('Failed to upload avatar:', err)
      setErrorMsg('Could not upload the new avatar. Please try another image.')
    } finally {
      setIsUploadingAvatar(false)
      if (ev.target) ev.target.value = ''
    }
  }

  const onUploadBackground = async (ev) => {
    try {
      setIsUploadingBackground(true)
      setErrorMsg('')
      const res = await uploadImg(ev)
      setUserToUpdate((prevState) => ({
        ...prevState,
        bg: res.url,
      }))
    } catch (err) {
      console.error('Failed to upload background image:', err)
      setErrorMsg('Could not upload the new background image. Please try another image.')
    } finally {
      setIsUploadingBackground(false)
      if (ev.target) ev.target.value = ''
    }
  }

  const onSaveUser = async (ev) => {
    ev.preventDefault()

    const normalizedFullname = userToUpdate.fullname.trim()
    if (!normalizedFullname) {
      setErrorMsg('Full name is required.')
      return
    }

    const payload = {
      ...user,
      ...userToUpdate,
      fullname: normalizedFullname,
      headline: userToUpdate.headline.trim(),
      profession: userToUpdate.headline.trim() || userToUpdate.profession.trim(),
      bio: userToUpdate.bio.trim(),
      address: userToUpdate.address.trim(),
      website: normalizeWebsite(userToUpdate.website),
      phone: userToUpdate.phone.trim(),
      additionalName: userToUpdate.additionalName.trim(),
      bg: userToUpdate.bg.trim(),
      imgUrl: userToUpdate.imgUrl,
    }

    try {
      setIsSaving(true)
      const savedUser = await dispatch(updateUser(payload))
      if (savedUser) toggleShowEditModal()
    } catch (err) {
      console.error('Failed to update profile:', err)
      setErrorMsg('Could not save your profile right now. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderCounter = (fieldName, limit) => {
    return (
      <span className="field-counter">
        {(userToUpdate[fieldName] || '').length}/{limit}
      </span>
    )
  }

  return (
    <section className="edit-modal">
      <div className="bg" onClick={toggleShowEditModal}></div>

      <article className="container">
        <header className="title">
          <div>
            <h2>Edit intro</h2>
            <p>Keep your profile details current so people can understand your work quickly.</p>
          </div>
          <button type="button" className="close-btn" onClick={toggleShowEditModal}>
            <FontAwesomeIcon icon="fa-solid fa-x" />
          </button>
        </header>

        <form className="form-container" onSubmit={onSaveUser}>
          <section className="form-section">
            <div className="section-heading">
              <h3>Basic info</h3>
              <p>This is the main information people see first on your profile.</p>
            </div>

            <div className="avatar-editor">
              <div className="avatar-preview-shell">
                <img
                  src={userToUpdate.imgUrl || user.imgUrl}
                  alt={userToUpdate.fullname || 'Profile'}
                  className="avatar-preview"
                />
                <label className="avatar-upload-btn" htmlFor="profile-avatar-upload">
                  <FontAwesomeIcon icon="fa-solid fa-plus" />
                </label>
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onUploadAvatar}
                />
              </div>
              <div className="avatar-copy">
                <strong>Profile photo</strong>
                <p>
                  Click the + button to choose a new avatar from your device.
                </p>
                {isUploadingAvatar && <span>Uploading new avatar...</span>}
              </div>
            </div>

            <label htmlFor="fullname" className="field-group">
              <span className="field-label">
                Full name <strong>*</strong>
              </span>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={userToUpdate.fullname}
                onChange={handleChange}
                placeholder="Your full name"
              />
              {renderCounter('fullname', fieldLimits.fullname)}
            </label>

            <label htmlFor="additionalName" className="field-group">
              <span className="field-label">Additional name</span>
              <input
                id="additionalName"
                name="additionalName"
                type="text"
                value={userToUpdate.additionalName}
                onChange={handleChange}
                placeholder={firstNamePlaceholder ? `${firstNamePlaceholder} ...` : 'Middle or additional name'}
              />
              {renderCounter('additionalName', fieldLimits.additionalName)}
            </label>

            <label htmlFor="headline" className="field-group">
              <span className="field-label">
                Headline <strong>*</strong>
              </span>
              <textarea
                id="headline"
                name="headline"
                value={userToUpdate.headline}
                onChange={handleChange}
                rows="4"
                placeholder="Example: Frontend developer building social experiences"
              />
              {renderCounter('headline', fieldLimits.headline)}
            </label>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <h3>About</h3>
              <p>Use this section to tell people what you do and what you are open to.</p>
            </div>

            <label htmlFor="bio" className="field-group">
              <span className="field-label">About</span>
              <textarea
                id="bio"
                name="bio"
                value={userToUpdate.bio}
                onChange={handleChange}
                rows="5"
                placeholder="Share a short summary about your experience, interests, or goals."
              />
              {renderCounter('bio', fieldLimits.bio)}
            </label>
          </section>

          <section className="form-section">
            <div className="section-heading">
              <h3>Contact & links</h3>
              <p>These text fields help complete the profile card without changing avatar or images.</p>
            </div>

            <div className="cover-editor">
              <div
                className="cover-preview"
                style={
                  userToUpdate.bg || user.bg
                    ? { backgroundImage: `url(${userToUpdate.bg || user.bg})` }
                    : undefined
                }
              >
                {!userToUpdate.bg && !user.bg && (
                  <div className="cover-placeholder">
                    <FontAwesomeIcon icon="fa-solid fa-image" />
                    <span>Add a cover image</span>
                  </div>
                )}
              </div>

              <div className="cover-copy">
                <strong>Background image</strong>
                <p>Upload a banner image from your computer to personalize the top of your profile.</p>
                <label className="cover-upload-btn" htmlFor="profile-background-upload">
                  <FontAwesomeIcon icon="fa-solid fa-plus" />
                  <span>{isUploadingBackground ? 'Uploading...' : 'Choose image'}</span>
                </label>
                <input
                  id="profile-background-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onUploadBackground}
                />
              </div>
            </div>

            <label htmlFor="address" className="field-group">
              <span className="field-label">Location</span>
              <input
                id="address"
                name="address"
                type="text"
                value={userToUpdate.address}
                onChange={handleChange}
                placeholder="City, country"
              />
              {renderCounter('address', fieldLimits.address)}
            </label>

            <label htmlFor="website" className="field-group">
              <span className="field-label">Website</span>
              <input
                id="website"
                name="website"
                type="text"
                value={userToUpdate.website}
                onChange={handleChange}
                placeholder="your-portfolio.com"
              />
              {renderCounter('website', fieldLimits.website)}
            </label>

            <label htmlFor="phone" className="field-group">
              <span className="field-label">Phone</span>
              <input
                id="phone"
                name="phone"
                type="text"
                value={userToUpdate.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
              {renderCounter('phone', fieldLimits.phone)}
            </label>
          </section>

          <footer className="btn-save-container">
            {errorMsg && <p className="form-error">{errorMsg}</p>}
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </footer>
        </form>
      </article>
    </section>
  )
}
