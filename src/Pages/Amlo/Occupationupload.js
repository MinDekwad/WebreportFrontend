import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  notification,
  Spin,
  Popconfirm,
  Result,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import swal from 'sweetalert'

const Occupationupload = () => {
  let history = useHistory()

  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user

  const [selectedFile, setSelectedFile] = useState()
  const [loading, setLoading] = useState(false)
  const [FileName, setFileName] = useState()

  const [statusSaveCSV, setStatusSaveCSV] = useState('error')
  const [statusUpdateCSV, setStatusUpdateCSV] = useState('error')

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
          let status = data.user_profile_amlo_fileimport_status

          let statusSaveCsv = status
          setStatusSaveCSV(statusSaveCsv)

          if (status === 'Success') {
            clearInterval(timechkData)
            setLoading(false)
            swal({
              title: 'Done!',
              text: 'Save Success',
              icon: 'success',
              button: 'close',
            }).then(() => {
              history.push({
                pathname: '/Amlo/Occupation',
              })
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
      // url: '/api/v1/reports/amlo/upload/userprofileamlocsv',
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
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <Form name="frm_occu_upload" style={{ textAlign: 'left' }}>
                  <input
                    type="file"
                    name="file"
                    onChange={changeHandler}
                    style={{ width: '400px' }}
                  />
                  <br />
                  <Button
                    disabled={!FileName ? true : false}
                    type="primary"
                    onClick={() => {
                      SaveCSVData(FileName)
                    }}
                  >
                    Upload
                  </Button>
                </Form>
                <Spin spinning={loading}>
                  <Result title="No preview data" />
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Occupationupload
