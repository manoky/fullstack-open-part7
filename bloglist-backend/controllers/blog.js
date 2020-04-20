const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const blogEvents = require('../socket/events')

router.get('/', async (req, res) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { body: 1 })

  const parsedBlogs = blogs.map(blog => blog.toJSON())

  res.status(200).json(parsedBlogs)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const blog = await Blog.findById(id)

  if (blog) {
    res.status(200).json(blog.toJSON())
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  const body = req.body

  const decodedToken = await jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(401).json({ error: 'You are not allowed to perform this operation' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const newBlog = await blog.save()
  await user.blogs.push(newBlog._id)
  await user.save()

  const parsedBlog = newBlog.toJSON()
  blogEvents.blogCreated(parsedBlog)
  res.status(201).end()
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    .populate('comments', { body: 1 })
  blogEvents.blogUpdated(updatedBlog.toJSON())
  res.status(201).end()
})

router.delete('/:id', async (req, res) => {
  const decodedToken = await jwt.verify(req.token, process.env.SECRET)
  const id = req.params.id

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const userId = decodedToken.id.toString()
  const blog = await Blog.findById(id)

  if (blog.user.toString() === userId) {
    await Blog.findByIdAndRemove(id)
    await Comment.deleteMany({ blog: id })
  } else {
    return res.status(401).json({ error: 'You are not allowed to perform this operation' })
  }

  blogEvents.blogDeleted(id)
  res.status(204).end()
})

router.post('/:id/comments', async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).json({ error: 'Comment should not be empty' })
  }

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(400).json({ error: 'The post you are commenting doesn\'t exist' })
  }

  const comment = await Comment({
    body: req.body.comment,
    blog: blog._id
  })

  comment.save()
  blog.comments.push(comment._id)
  blog.save()

  blogEvents.blogComment({ comment: comment.toJSON(), id: req.params.id })
  res.status(201).end()
})


module.exports = router