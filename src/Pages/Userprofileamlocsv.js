import React, { useState, useCallback, useContext } from 'react'
import swal from 'sweetalert'
import { notification, Result, Spin, Button } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { SaveOutlined } from '@ant-design/icons'

const UserProfileAmloCSV = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [selectedFile, setSelectedFile] = useState()

  const [loading, setLoading] = useState(false)

  const [FileName, setFileName] = useState()

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0])

    let filename = event.target.files[0]?.name
    fetchDataUserProfileAmloName(filename)
  }

  const fetchDataUserProfileAmloName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseUserProfileAmloName = await axios.get(
        `/api/v1/reports/csv/userProfileAmloName?filename=${filename}`,
      )
      const { data: CountUserProfileAmloName } = responseUserProfileAmloName
      const { data } = CountUserProfileAmloName

      if (data !== 0) {
        swal({
          title: 'Error',
          text: 'This file already exists',
          icon: 'error',
          button: 'close',
        })
        return
      }
      setFileName(filename)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get file name user profile amlo csv error  : ${message}`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseUserProfileAmloFileimport = await axios.get(
            `/api/v1/reports/csv/userProfileAmloFileimportStatus?filename=${filename}`,
          )
          const { data: UserProfileAmloFileimport } =
            responseUserProfileAmloFileimport
          const { data } = UserProfileAmloFileimport
          console.log(data)
          let status = data.user_profile_amlo_fileimport_status
          if (status === 'Success') {
            clearInterval(timechkData)
            setLoading(false)
            swal({
              title: 'Done!',
              text: 'Save Success',
              icon: 'success',
              button: 'close',
            })
          }
        } catch (err) {
          const { status, message } = getErrorMessage(err)
          notification.warning({
            message: `(${status}) Get status file import user profile amlo csv error : ${message}`,
          })
        }
      },
      5000,
      [],
    )
  }

  const SaveCSVData = async (filename) => {
    setLoading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)

    const axios = getAxios({ access_token })
    const {
      data: { message },
    } = await axios({
      method: 'post',
      url: '/api/v1/reports/csv/upload/userprofileamlocsv',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30 * 1000,
    })

    if (message === 'success') {
      intervalCheckProgress(filename)
      return
    }

    swal({
      title: 'Error',
      text: 'Cannot save data',
      icon: 'error',
      timer: 2000,
      button: false,
    })
  }

  return (
    <div>
      <h5 className="m-0">Import User Profile Amlo CSV</h5>
      <br />
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        style={{ width: '400px' }}
      />
      <br />
      <br />
      <Button
        disabled={!FileName ? true : false}
        type="primary"
        icon={<SaveOutlined />}
        onClick={() => {
          SaveCSVData(FileName)
        }}
      >
        Save
      </Button>
      <br />
      <Spin spinning={loading}>
        <Result title="No preview data" />
      </Spin>
    </div>
  )
}
export default UserProfileAmloCSV
