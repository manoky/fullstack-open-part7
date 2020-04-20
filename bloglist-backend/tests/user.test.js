const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helpers')
const User = require('../models/user')


const api = supertest(app)

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('something', 10)
    const user = new User({ username: 'root', passwordHash, name: 'James Moore' })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'nodex',
      name: 'Jon Smith',
      password: 'somethingNew'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    const usersAtEnd = await helper.usersInDB()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)

    expect(usernames).toContain(newUser.username)
  })


  test('returns all users', async () => {
    const usersAtStart = await helper.usersInDB()

    const returnedUsers = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(returnedUsers.body).toHaveLength(usersAtStart.length)
  })

  test('returns 400 if username already exist', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      name: 'Jon Smith',
      password: 'somethingNew'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDB()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('returns 400 if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      name: 'Jon Smith',
      password: 'so'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)

    const usersAtEnd = await helper.usersInDB()

    expect(response.body.error).toContain('password is too short')
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})
