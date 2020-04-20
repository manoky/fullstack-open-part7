const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helpers')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('blogs', () => {
  let blogs = []
  let token = null
  let initialUser = null

  beforeEach(async () => {
    blogs = helper.initialBlogs
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('something', 10)
    const user = new User({ username: 'root', passwordHash, name: 'James Moore' })
    await user.save()

    initialUser = user
    const userForToken = {
      username: user.username,
      id: user._id
    }

    token = await jwt.sign(userForToken, process.env.SECRET)

    const blogList = helper.initialBlogs.map(blog => new Blog({
      ...blog,
      user: user._id.toString()
    }))
    const promiseArray = blogList.map(blog =>
      blog.save()
    )

    await Promise.all(promiseArray)

  })

  test('dummy returns one', () => {
    const blogs = []

    const results = listHelper.dummy(blogs)
    expect(results).toBe(1)
  })

  describe('total likes', () => {

    test('it return the sum of each blog likes', () => {
      const result = listHelper.totalLikes(blogs)
      expect(result).toBe(36)
    })

    test('it returns the favorite blogs with most likes', () => {
      const favorite = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      }
      const result = listHelper.favoriteBlog(blogs)

      expect(result).toEqual(favorite)
    })

  })

  describe('Blog authors', () => {
    test('returns author with most blogs', () => {

      const most = {
        author: 'Robert C. Martin',
        blogs: 3
      }

      const result = listHelper.mostBlogs(blogs)
      expect(result).toContainEqual(most)
    })

    test('returns author with most likes', () => {

      const most = {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }

      const result = listHelper.mostLikes(blogs)
      expect(result).toContainEqual(most)
    })
  })

  describe('when there is initially some blogs saved', () => {
    test('Blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const returnedBlogs = await api.get('/api/blogs')

      const titles = returnedBlogs.body.map(blog => blog.title)

      expect(titles).toContain(
        'Canonical string reduction'
      )
    })

  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(JSON.stringify(resultBlog.body)).toEqual(JSON.stringify(blogToView))
    })

    test('fails with status code 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExisitingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })


  describe('addition of a new note', () => {

    test('succeeds with valid data', async () => {

      const newBlog = {
        title: 'Testing made easy by fullstack-hy2020',
        author: 'John Doe',
        url: 'http://example.com',
        likes: 10,
        user: initialUser._id
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)

      expect(titles).toContain(
        'Testing made easy by fullstack-hy2020'
      )
    })

    test('id is present in blogs instead of _id', async () => {
      const blogsList = await helper.blogsInDb()
      const blog = blogsList[0]

      expect(blog.id).toBeDefined()
    })

    test('return 0 likes if no likes params is empty', async () => {
      const newBlog = {
        title: 'blog with no like',
        author: 'John Like',
        url: 'http://example.com'
      }

      const blog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(blog.body.likes).toBe(0)
    })

    test('fails with status code 400 if data invaild', async () => {
      const newBlog = {
        author: 'Jon Yong',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogs = await helper.blogsInDb()

      const blogId = blogs[0].id

      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    })

    test('returns status code 401 if no token is present', async () => {
      const blogs = await helper.blogsInDb()

      const blogId = blogs[0].id

      const deleteBlog = await api
        .delete(`/api/blogs/${blogId}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      expect(deleteBlog.body.error).toContain('invalid token')
    })

    test('returns status code 401 if wrong token is present', async () => {
      const blogs = await helper.blogsInDb()
      const passwordHash = await bcrypt.hash('wrongToken', 10)

      const user = new User({
        username: 'tokenx',
        name: 'Tom Token',
        passwordHash
      })

      await user.save()

      const userForToken = {
        username: user.username,
        id: user._id
      }

      const wrongToken = await jwt.sign(userForToken, process.env.SECRET)

      const blogId = blogs[0].id

      const deleteBlog = await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${wrongToken}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      expect(deleteBlog.body.error).toContain('You are not allowed to perform this operation')
    })


  })

  describe('updating of a blog', () => {

    test('update blog likes', async () => {
      const blogs = await helper.blogsInDb()
      const blogId = blogs[0].id
      const blogToUpdate = {
        title: blogs[0].title,
        author: blogs[0].author,
        url: blogs[0].url,
        likes: 20
      }

      const updatedBlog = await api
        .put(`/api/blogs/${blogId}`)
        .send(blogToUpdate)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(updatedBlog.body.likes).toBe(20)
    })

  })


  afterAll(() => {
    blogs= []
    token = null
    initialUser = null
    mongoose.connection.close()
  })

})