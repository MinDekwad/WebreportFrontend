import axios from 'axios'
const endPointAPI = process.env.REACT_APP_API || ''

export const getAxios = ({ access_token }) => {
  const instance = axios.create({
    baseURL: endPointAPI,
    timeout: 10 * 1000,
    headers: { Authorization: `Bearer ${access_token}` },
  })
  return instance
}

export const getErrorMessage = (error) => {
  const { response, message: errMessage } = error || {}
  const { status, data } = response || {}
  const { message } = data || {}
  const msg = message || errMessage
  return { status, message: msg }
}
