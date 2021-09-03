import React, { useState, useCallback, useContext } from 'react'
import swal from 'sweetalert'
import { notification, Result, Spin, Button } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { SaveOutlined } from '@ant-design/icons'

const ConsumerCSV = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [selectedFile, setSelectedFile] = useState()

  const [loading, setLoading] = useState(false)

  const [FileName, setFileName] = useState()

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0])

    let filename = event.target.files[0]?.name
    fetchDataConsumerName(filename)
  }

  const fetchDataConsumerName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseConsumerName = await axios.get(
        `/api/v1/reports/csv/consumerFileName?filename=${filename}`,
      )
      const { data: CountConsumerName } = responseConsumerName
      const { data } = CountConsumerName

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
        message: `(${status}) Get file name consumer transaction csv error  : ${message}`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseConsumerFileimport = await axios.get(
            `/api/v1/reports/csv/ConsumerFileimportStatus?filename=${filename}`,
          )
          const { data: ConsumerFileimport } = responseConsumerFileimport
          const { data } = ConsumerFileimport
          let status = data.consumer_fileimport_status
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
            message: `(${status}) Get status file import consumer transaction csv error : ${message}`,
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
      url: '/api/v1/reports/csv/upload/consumercsv',
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
      <h5 className="m-0">Import Consumer CSV</h5>
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
export default ConsumerCSV
