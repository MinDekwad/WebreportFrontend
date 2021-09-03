import React, { useEffect, useCallback, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../userContext'
import { Redirect } from 'react-router-dom'
import { notification } from 'antd'
import * as dayjs from 'dayjs'
import { FormText } from 'react-bootstrap'

const host = process.env.REACT_APP_API || ''

function useQuery() {
  const query = new URLSearchParams(useLocation().search)
  return { state: query.get('state'), code: query.get('code') }
}

export const Success = () => {
  //  const [stateMismatch, setStateMismacth] = useState(false)
  const { code, state } = useQuery()
  const {
    dispatch,
    user: { login },
  } = useContext(UserContext)

  const getAccesstoken = useCallback(async () => {
    const local = localStorage.getItem('state')
    if (state !== local) {
      return
    }

    try {
      let PostData = {
        code: code,
        state: state,
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/login?state=${state}`,
        PostData,
      )

      const { access_token: accessToken, scope, token_type } = data || {}

      const { data: permissions } = await axios({
        method: 'get',
        baseURL: host,
        //url: `/permissions`,
        url: `/api/v1/permissions`,
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      const _permissions = permissions.data.map((p) => {
        const { service_resource, action } = p
        return { ...service_resource, action }
      })

      const { data: userinfo } = await axios({
        method: 'get',
        baseURL: host,
        url: `/api/v1/userinfo`,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      // console.log('user info : ', userinfo.given_name)
      // const userData = userinfo.given_name
      //console.log('user info : ', userinfo.name)
      const userData = userinfo.name
      //const userData = userinfo.given_name
      //console.log('userData : ', userData)
      // const userInfoData = userinfo.name.map((d) => {
      //   const { user } = d
      //   return { user }
      // })

      localStorage.removeItem('state', state)
      const exp = dayjs().second(3600).format()

      dispatch({
        type: 'login',
        data: {
          exp: exp,
          permissions: _permissions,
          access_token: accessToken,
          scope,
          token_type,
          userData: userData,
        },
      })
    } catch (error) {
      notification.warn({
        description: 'Please see the logcat.',
        message: 'Request get access_token has an errors.',
      })
    }
  }, [code, dispatch, state])

  useEffect(() => {
    getAccesstoken()
    return () => {}
  }, [getAccesstoken])

  if (login) return <Redirect to="/" />

  return <></>
}
