import React, { createContext, useReducer, useEffect } from 'react'

export const UserContext = createContext({}) // Create a context object

const initialState = JSON.parse(localStorage.getItem('user-reports')) || {}

const LOGOUT_TYPE = 'logout'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      const { data } = action
      return { ...state, login: true, ...data }
    case LOGOUT_TYPE:
      return {
        ...state,
        login: false,
        access_token: '',
        id_token: '',
        scope: '',
      }
    default:
      throw new Error()
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, initialState)

  useEffect(() => {
    localStorage.setItem('user-reports', JSON.stringify(user))
  }, [user])

  // const isAllowed = (module, action = "READ") => {
  const isAllowed = (module) => {
    const { permissions } = user
    if (!permissions || permissions.length < 1) return false
    //const allow = permissions.find((p) => p.name === module && p.action === action)
    const allow = permissions.find((p) => p.name === module)
    if (!allow) {
      return false
    }
    return true
  }

  return (
    <UserContext.Provider value={{ user, dispatch, isAllowed }}>
      {children}
    </UserContext.Provider>
  )
}
