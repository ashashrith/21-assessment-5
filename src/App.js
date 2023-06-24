import './App.css'

import {Switch, Route, Redirect} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import JobItemDetailsRoute from './components/JobItemDetailsRoute'
import JobsRoute from './components/JobsRoute'
import LoginRoute from './components/LoginRoute'
import NotFoundRoute from './components/NotFoundRoute'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <div>
    <Switch>
      <Route exact path="/login" component={LoginRoute} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={JobsRoute} />
      <ProtectedRoute exact path="/jobs/:id" component={JobItemDetailsRoute} />
      <Route path="/not-found" component={NotFoundRoute} />
      <Redirect to="not-found" />
    </Switch>
  </div>
)

export default App
