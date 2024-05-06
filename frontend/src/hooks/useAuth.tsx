import axios from 'axios'
import { isEmpty } from 'lodash-es'

function getAuthUser() {
  const jwt = window.localStorage.getItem('jwtTokenDB')

  if (!jwt) return {}

  return JSON.parse(atob(jwt))
}

const actions = {
  login: (user) => {
    window.localStorage.setItem('jwtTokenDB', btoa(JSON.stringify(user)))

    axios.defaults.headers.Authorization = `Token ${user.token}`
  },
  logout: () => {
    window.localStorage.removeItem('jwtTokenDB')
  },
  checkAuth: () => {
    const authUser = getAuthUser()

    if (!authUser || isEmpty(authUser)) {
      actions.logout()
      return false
    } else {
        return true
    }
  },
}

function useAuth() {
  return {
    ...actions,
  }
}

export default useAuth