import axios from 'axios'
const baseUrl = '/api/blogs'
const loginUrl = '/api/login'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const login = async (credentials) => {
  const request = await axios.post(loginUrl, credentials)

  return request.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

const update = async (id, updateBlog) => {
  const request = await axios.put(`${baseUrl}/${id}`, updateBlog)
  return request.data
}

const destroy = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}

export default {
  getAll,
  login,
  setToken,
  create,
  update,
  destroy
}