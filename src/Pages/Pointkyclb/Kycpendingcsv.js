import React, { useState, useCallback, useContext } from 'react'
import swal from 'sweetalert'
import { notification, Result, Spin, Button } from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { SaveOutlined } from '@ant-design/icons'

const Kycpendingcsv = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [selectedFile, setSelectedFile] = useState()

  const [loading, setLoading] = useState(false)

  const [FileName, setFileName] = useState()

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0])

    let filename = event.target.files[0]?.name
    fetchDataKycPendingName(filename)
  }

  const fetchDataKycPendingName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseKycPendingName = await axios.get(
        `/api/v1/reports/csv/kycPendingFileName?filename=${filename}`,
      )
      const { data: CountKycPendingName } = responseKycPendingName
      const { data } = CountKycPendingName

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
        message: `(${status}) Get file name kyc pending csv error  : ${message}`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseKycpendingFileimport = await axios.get(
            `/api/v1/reports/csv/KycPendingFileimportStatus?filename=${filename}`,
          )
          const { data: KycPendingFileimport } = responseKycpendingFileimport
          const { data } = KycPendingFileimport
          let status = data.kyc_pending_fileimport_status
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
            message: `(${status}) Get status file import kyc pending csv error : ${message}`,
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
      url: '/api/v1/reports/csv/upload/kycpendingcsv',
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
      <h5 className="m-0">Import KYC pending CSV</h5>
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
export default Kycpendingcsv
