import { Route, Redirect } from 'react-router-dom'
import { userService } from '../services/user/userService'

function PrivateRoute({ component: Component, render, ...rest }) {
  const isAuthenticated = userService.getLoggedinUser()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/signin" />
        }
        return Component ? <Component {...props} /> : render(props)
      }}
    />
  )
}

export default PrivateRoute
