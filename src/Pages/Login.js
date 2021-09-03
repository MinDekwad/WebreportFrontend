import React, { useEffect, useCallback } from 'react'
import axios from 'axios'
import { notification } from 'antd'

import { v4 as uuidv4 } from 'uuid'
const host = process.env.REACT_APP_HOST || ''

export const OAuth2 = () => {
  const getRedirectURL = useCallback(async () => {
    const state = uuidv4()
    //const state = "ufryruktkjt";
    localStorage.setItem('state', state)
    try {
      const responseData = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/login?state=${state}`,
      )
      const data = responseData.data
      const url = data.url
      window.location = `${url}`
    } catch (error) {
      notification.warn({ message: 'Request Login error' })
    }
  }, [])

  useEffect(() => {
    getRedirectURL()
  }, [getRedirectURL])

  return <></>
}
