import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, signup, logout } from '../store/actions/userActions'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Logo } from '../assets/imgs/Logo'
import { VALIDATION_RULES } from '../config/constants'

const normalizeCred = (cred, isSignin) => {
  const normalizedCred = {
    username: cred.username.trim(),
    email: cred.email.trim(),
    password: cred.password,
    fullname: cred.fullname.trim(),
  }

  if (isSignin) {
    delete normalizedCred.fullname
    delete normalizedCred.email
  }
  return normalizedCred
}

const validateCred = (cred, isSignin) => {
  const { username, email, password, fullname } = normalizeCred(cred, isSignin)

  if (!username) return 'Username is required.'
  if (!VALIDATION_RULES.USERNAME.PATTERN.test(username)) {
    return 'Username can only contain letters, numbers, and underscores.'
  }
  if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    return `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters.`
  }
  if (username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    return `Username must be at most ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters.`
  }
  if (!password) return 'Password is required.'
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters.`
  }
  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return `Password must be at most ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters.`
  }

  if (!isSignin) {
    if (!email) return 'Email is required.'
    if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
      return 'Please enter a valid email address.'
    }
    if (!fullname) return 'Full name is required.'
    if (fullname.length < VALIDATION_RULES.FULLNAME.MIN_LENGTH) {
      return `Full name must be at least ${VALIDATION_RULES.FULLNAME.MIN_LENGTH} characters.`
    }
    if (fullname.length > VALIDATION_RULES.FULLNAME.MAX_LENGTH) {
      return `Full name must be at most ${VALIDATION_RULES.FULLNAME.MAX_LENGTH} characters.`
    }
  }

  return ''
}

const getErrorMessage = (err, fallbackText) => {
  const serverMessage = err?.response?.data?.message || err?.message
  if (!serverMessage) return fallbackText
  if (typeof serverMessage === 'string' && serverMessage.startsWith('Error: ')) {
    return serverMessage.slice(7)
  }
  return typeof serverMessage === 'string' ? serverMessage : fallbackText
}

export const Signup = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [signin, setIsSignin] = useState(true)
  const [cred, setCred] = useState({
    username: '',
    email: '',
    password: '',
    fullname: '',
  })
  const [msg, setMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { loggedInUser } = useSelector((state) => state.userModule)

  const handleChange = async ({ target }) => {
    const field = target.name
    let value = target.type === 'number' ? +target.value || '' : target.value
    setCred((prevCred) => ({ ...prevCred, [field]: value }))
    if (msg) setMsg('')
  }

  const cleanFields = () =>
    setCred(() => ({ username: '', email: '', password: '', fullname: '' }))

  const doLogin = async () => {
    const validationError = validateCred(cred, true)
    if (validationError) {
      setMsg(validationError)
      return
    }

    setIsSubmitting(true)
    setMsg('')

    try {
      const user = await dispatch(login(normalizeCred(cred, true)))
      if (user) {
        cleanFields()
        history.push('/main/feed')
      }
    } catch (err) {
      setMsg(getErrorMessage(err, 'Unable to sign in right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const doLogout = async () => {
    dispatch(logout())
    cleanFields()
  }

  const doSignup = async () => {
    const validationError = validateCred(cred, false)
    if (validationError) {
      setMsg(validationError)
      return
    }

    setIsSubmitting(true)
    setMsg('')

    try {
      const user = await dispatch(signup(normalizeCred(cred, false)))
      if (user) {
        cleanFields()
        history.push('/main/feed')
      }
    } catch (err) {
      setMsg(getErrorMessage(err, 'Unable to create your account right now.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const doSubmit = () => {
    if (signin) doLogin()
    else {
      doSignup()
    }
  }

  const toggle = () => {
    setIsSignin((prevVal) => !prevVal)
    setMsg('')
    setIsSubmitting(false)
  }

  if (loggedInUser) {
    return (
      <section className="sign-up-page">
        <header className="signup-header">
          <Logo />
        </header>
        
        <div className="logged-in-container">
          <div className="logged-in-card">
            <div className="user-profile">
              <div className="img-container">
                <img src={loggedInUser.imgUrl} alt={loggedInUser.fullname} className="profile-img" />
              </div>
              <h2>Welcome back, {loggedInUser.fullname}!</h2>
              <p>You're already signed in</p>
            </div>
            
            <div className="action-buttons">
              <button className="feed-button" onClick={() => history.push('/main/feed')}>
                Go to Feed
              </button>
              <button className="logout-button" onClick={doLogout}>
                <FontAwesomeIcon icon="arrow-right-from-bracket" className="btn-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="sign-up-page">
      <header className="signup-header">
        <Logo />
      </header>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{signin ? 'Welcome Back' : 'Join Linkedout'}</h1>
            <p>Connect with travelers around the world</p>
          </div>
          
          <form
            onSubmit={(ev) => {
              ev.preventDefault()
              doSubmit()
            }}
            className="auth-form"
          >
            {!signin && (
              <div className="input-group">
                <label htmlFor="fullname">Full Name</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon="user" className="input-icon" />
                  <input
                    required
                    onChange={handleChange}
                    type="text"
                    placeholder="Your full name"
                    id="fullname"
                    name="fullname"
                    value={cred.fullname}
                    minLength={VALIDATION_RULES.FULLNAME.MIN_LENGTH}
                    maxLength={VALIDATION_RULES.FULLNAME.MAX_LENGTH}
                  />
                </div>
              </div>
            )}

            {!signin && (
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon="envelope" className="input-icon" />
                  <input
                    required
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    name="email"
                    value={cred.email}
                  />
                </div>
              </div>
            )}
            
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon="user" className="input-icon" />
                <input
                  onChange={handleChange}
                  type="text"
                  id="username"
                  name="username"
                  value={cred.username}
                  placeholder="Enter your username"
                  required
                  minLength={VALIDATION_RULES.USERNAME.MIN_LENGTH}
                  maxLength={VALIDATION_RULES.USERNAME.MAX_LENGTH}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon="lock" className="input-icon" />
                <input
                  onChange={handleChange}
                  type="password"
                  id="password"
                  name="password"
                  value={cred.password}
                  placeholder="Enter your password"
                  required
                  minLength={VALIDATION_RULES.PASSWORD.MIN_LENGTH}
                  maxLength={VALIDATION_RULES.PASSWORD.MAX_LENGTH}
                />
              </div>
            </div>

            {!signin && (
              <div className="forgot-password">
                <p>
                  Use your full name, email, a username with letters, numbers, or underscores, and a password of at least 6 characters.
                </p>
              </div>
            )}

            {msg && (
              <div className="error-message">
                <FontAwesomeIcon icon="exclamation-circle" />
                <p>{msg}</p>
              </div>
            )}
            
            {signin && (
              <div className="forgot-password">
                <button type="button" onClick={(e) => e.preventDefault()} className="forgot-password-btn">
                  Forgot password?
                </button>
              </div>
            )}
            
            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {signin ? (isSubmitting ? 'Signing In...' : 'Sign In') : (isSubmitting ? 'Creating Account...' : 'Create Account')}
            </button>
            
            <div className="mode-toggle">
              <p>
                {signin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.preventDefault()
                    toggle()
                  }}
                  className="toggle-auth-link"
                >
                  {signin ? 'Join Now' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        </div>
        
        <div className="auth-features">
          <h2>Why Join Linkedout?</h2>
          <div className="features-list">
            <div className="feature-item">
              <FontAwesomeIcon icon="user-friends" className="feature-icon" />
              <div className="feature-text">
                <h3>Connect with Travelers</h3>
                <p>Build your network of travel enthusiasts from around the globe</p>
              </div>
            </div>
            
            <div className="feature-item">
              <FontAwesomeIcon icon="comments" className="feature-icon" />
              <div className="feature-text">
                <h3>Share Your Experiences</h3>
                <p>Post photos, tips, and stories from your adventures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
