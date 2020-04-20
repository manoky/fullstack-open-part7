import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let blog

  beforeEach(() => {
    blog = {
      user: {
        _id: '5a43e6b6c37f3d065eaaa581',
        username: 'mluukkai',
        name: 'Matti Luukkainen'
      },
      likes: 0,
      author: 'Joel Spolsky',
      title: 'The Joel Test: 12 Steps to Better Code',
      url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/'
    }
    component = render(
      <Blog blog={blog} />
    )
  })

  test('renders title and author', () => {

    const element = component.container.querySelector('.blog-preview')

    expect(element).toHaveTextContent(
      `${blog.title} ${blog.author}`
    )
  })

  test('renders blog likes and url', () => {
    const button = component.container.querySelector('.toggle-btn')
    fireEvent.click(button)

    const element = component.container.querySelector('.blog-details')
    const blogLikes = component.getByText(`likes ${blog.likes}`)
    const blogUrl = component.getByText(`${blog.url}`)

    expect(element).not.toHaveStyle('display: none')
    expect(blogLikes).toBeDefined()
    expect(blogUrl).toBeDefined()
  })

  test('updates the parent and calls handleUpdate', () => {
    const handleUpdate = jest.fn()

    const component = render(
      <Blog blog={blog} handleUpdate={handleUpdate} />
    )

    const button = component.container.querySelector('.like-btn')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(handleUpdate.mock.calls).toHaveLength(2)

    expect(handleUpdate.mock.calls[0][1].likes).toBe(blog.likes + 1)
  })

})