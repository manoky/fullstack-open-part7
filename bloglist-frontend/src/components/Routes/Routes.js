import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import BlogList from '../Blog/BlogList'
import BlogForm from '../Forms/BlogForm'
import LoginForm from '../Forms/LoginForm'
import BlogDetails from '../Blog/BlogDetails'
import UsersList from '../Users/UsersList'
import UserDetails from '../Users/UserDetails'

const Routes = ({ foundUser, blog, users, user }) => {
  return (
    <Switch>
      <Route path='/blogs/:id'>
        {blog &&<BlogDetails blog={blog} />}
      </Route>
      <Route path='/login'>
        <LoginForm />
      </Route>
      <Route path='/create'>
        {
          user
            ? <BlogForm />
            : <Redirect to='/login' />
        }
      </Route>
      <Route path='/users' exact>
        {
          user
            ? <UsersList users={users} />
            : <Redirect to='/login' />
        }
      </Route>
      <Route path='/users/:id' exact>
        <UserDetails user={foundUser} />
      </Route>
      <Route path='/'>
        <BlogList user={user} />
      </Route>
    </Switch>
  )
}

export default Routes