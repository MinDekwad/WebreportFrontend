import React, { useState, useEffect, useCallback, useContext } from 'react'
import swal from 'sweetalert'
import { Table } from 'ant-table-extensions'
import { notification, Spin, Button } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { SaveOutlined } from '@ant-design/icons'

const MerchantCSV = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [selectedFile, setSelectedFile] = useState()
  let selFile = selectedFile
  let btnDisable
  if (selFile === undefined) {
    btnDisable = true
  } else if (selFile !== undefined) {
    btnDisable = false
  }

  const [isSelected, setIsSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [FileName, setFileName] = useState()

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0])
    setIsSelected(true)

    let filename = event.target.files[0]?.name
    fetchDataMerchantName(filename)
  }

  const fetchDataMerchantName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseMerchantName = await axios.get(
        `/api/v1/reports/csv/merchantFileName?filename=${filename}`,
      )
      const { data: CountMerchantName } = responseMerchantName
      const { data } = CountMerchantName

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
        message: `(${status}) Get file name merchant csv error : ${message}`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseMerchantFileimport = await axios.get(
            `/api/v1/reports/csv/MerchantFileimportStatus?filename=${filename}`,
          )
          const { data: MerchantFileimport } = responseMerchantFileimport
          const { data } = MerchantFileimport
          let status = data.merchant_fileimport_status
          let id = data.merchant_fileimport_id
          if (status === 'Success') {
            showData(id)
            clearInterval(timechkData)
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
            message: `(${status}) Get status file import merchant csv error : ${message}`,
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
      url: '/api/v1/reports/csv/upload/merchantcsv',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
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

  const showData = async (id) => {
    setLoading(false)
    try {
      const axios = getAxios({ access_token })
      const responseMerchantCSV = await axios.get(
        `/api/v1/reports/csv/MerchantCSV?fileimportid=${id}`,
      )
      let {
        data: { data },
      } = responseMerchantCSV
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setData(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data merchant csv error : ${message}`,
      })
    }
  }

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',

      align: 'center',
    },
    {
      title: 'Date Time',
      dataIndex: 'dateTime',

      align: 'center',
      render: (value, row, index) => {
        return <span>{value.replace('T', ' ').replace('Z', ' ')}</span>
      },
    },
    {
      title: 'Merchant ID',
      dataIndex: 'MerchantID',

      align: 'center',
    },
    {
      title: 'Terminal ID',
      dataIndex: 'TerminalID',

      align: 'center',
    },
    {
      title: 'Merchant FullName',
      dataIndex: 'MerchantFullName',

      align: 'center',
    },
  ]

  return (
    <div>
      <h5 className="m-0">Import Merchant Transaction CSV</h5>
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
        <Table columns={columns} dataSource={data} scroll={{ y: '57vh' }} />
      </Spin>
    </div>
  )
}
export default MerchantCSV
