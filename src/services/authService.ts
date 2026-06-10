import api from './api'

export const loginAdmin = async (username: string, password: string) => {
  const response = await api.post('/Auth/login', {
    username,
    password,
  })

  return response.data
}