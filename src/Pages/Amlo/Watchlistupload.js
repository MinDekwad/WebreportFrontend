import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  notification,
  Spin,
  Popconfirm,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert'

const Watchlistupload = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user

  const [selectedFile, setSelectedFile] = useState()
  const [FileName, setFileName] = useState()
  const [statusSaveCSV, setStatusSaveCSV] = useState('error')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const fetchDataWatchList = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(`/api/v1/reports/amlo/watchlist`)
      let { data } = responseData.data
      data = data.map((d, i) => {
        const { edges } = d || { edges: {} }
        const { related } = edges || { related: {} }
        return {
          ...related,
          ...d,
          key: d.id,
        }
      })
      setData(data)
      setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data watchlist error : ${message}`,
      })
      setLoading(false)
    }
  }, [])

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0])
    let filename = event.target.files[0]?.name
    fetchDataWatchlistName(filename)
  }

  const fetchDataWatchlistName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseWatchlistName = await axios.get(
        `/api/v1/reports/csv/watchlistName?filename=${filename}`,
      )
      const { data: CountWatchlistName } = responseWatchlistName
      const { data } = CountWatchlistName

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
        message: `(${status}) Get file name user watch list csv error  : ${message}`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseUserProfileAmloFileimport = await axios.get(
            `/api/v1/reports/csv/watchlistFileimportStatus?filename=${filename}`,
          )
          const { data: UserProfileAmloFileimport } =
            responseUserProfileAmloFileimport
          const { data } = UserProfileAmloFileimport
          let status = data.watchlist_fileimport_status

          let statusSaveCsv = status
          setStatusSaveCSV(statusSaveCsv)

          if (status === 'Dup') {
            clearInterval(timechkData)
            setLoading(false)
            fetchDataWatchList()
            swal({
              title: 'Error!',
              text: 'Data duplicate',
              icon: 'error',
              button: 'close',
            })
          } else if (status === 'Success') {
            clearInterval(timechkData)
            setLoading(false)
            fetchDataWatchList()
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
            message: `(${status}) Get status file import watchlist csv error : ${message}`,
          })
        }
      },
      5000,
      [],
    )
  }

  const SaveCSVData = async (filename) => {
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const axios = getAxios({ access_token })
      const {
        data: { message },
      } = await axios({
        method: 'post',
        url: `/api/v1/reports/csv/upload/watchlistcsv?user=${userData}`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30 * 1000,
      })
      console.log(data)
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
    } catch {
      swal({
        title: 'Error',
        text: 'Please check data',
        icon: 'error',
        timer: 5000,
        button: 'close',
      })
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'ชื่อ นามสกุล',
      dataIndex: 'Name',
      align: 'left',
    },
    {
      title: 'เลขประจำตัวประชาชน',
      dataIndex: 'TaxID',
      align: 'left',
    },
    {
      title: 'ประเภท',
      dataIndex: 'TypeName',
      align: 'left',
    },
  ]

  useEffect(() => {
    fetchDataWatchList()
  }, [])

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <Form name="frm_watchlist_upload" style={{ textAlign: 'left' }}>
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
                <div style={{ clear: 'both' }}></div>
                <br />
                <div className="row">
                  {
                    <Spin spinning={loading} tip="Loading">
                      <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ y: '57vh' }}
                      />
                    </Spin>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Watchlistupload
