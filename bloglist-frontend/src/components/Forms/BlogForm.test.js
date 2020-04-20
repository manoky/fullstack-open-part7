import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm/>', () => {
  test('updates parents and calls addBlog', () => {
    const addBlog = jest.fn()
    const component = render(
      <BlogForm addBlog={addBlog} />
    )
    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const submit = component.getByText('create')

    fireEvent.change(titleInput,{
      target: { value: 'React patterns' }
    })

    fireEvent.change(authorInput,{
      target: { value: 'Michael Chan' }
    })

    fireEvent.change(urlInput,{
      target: { value: 'https://reactpatterns.com/' }
    })

    fireEvent.click(submit)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('React patterns')
    expect(addBlog.mock.calls[0][0].author).toBe('Michael Chan')
    expect(addBlog.mock.calls[0][0].url).toBe('https://reactpatterns.com/')
  })
})