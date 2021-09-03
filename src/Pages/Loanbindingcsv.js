import React, { useState, useEffect, useCallback, useContext } from 'react'
import swal from 'sweetalert'
import { Table } from 'ant-table-extensions'
import { notification, Spin, Button } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { SaveOutlined } from '@ant-design/icons'

const LoanbindingCSV = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [selectedFile, setSelectedFile] = useState()
  const [isSelected, setIsSelected] = useState(false)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [FileName, setFileName] = useState()

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0])
    setIsSelected(true)

    let filename = event.target.files[0]?.name
    fetchDataLoanbindingName(filename)
  }

  const fetchDataLoanbindingName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseLoanbindingName = await axios.get(
        `/api/v1/reports/csv/loanbindingFileName?filename=${filename}`,
      )
      const { data: CountLoanbindingName } = responseLoanbindingName
      const { data } = CountLoanbindingName

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
        message: `(${status}) Get file name loanbinding csv error : ${message}`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseLoanbindingFileimport = await axios.get(
            `/api/v1/reports/csv/LoanbindingFileimportStatus?filename=${filename}`,
          )
          const { data: LoanbindingFileimport } = responseLoanbindingFileimport
          const { data } = LoanbindingFileimport
          let status = data.loanbinding_fileimport_status
          let id = data.loanbinding_fileimport_id
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
            message: `(${status}) Get status file import loanbinding csv error : ${message}`,
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
      url: '/api/v1/reports/csv/upload/loanbindingcsv',
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
      const responseLoanbindingCSV = await axios.get(
        `/api/v1/reports/csv/LoanbindingCSV?fileimportid=${id}`,
      )
      let {
        data: { data },
      } = responseLoanbindingCSV
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
        message: `(${status}) Get data loanbinding csv error  : ${message}`,
      })
    }
  }

  const columns = [
    {
      title: 'Wallet Id',
      dataIndex: 'WalletId',

      align: 'center',
    },
    {
      title: 'Account Reference',
      dataIndex: 'AccountReference',

      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Loan Account No',
      dataIndex: 'LoanAccountNo',

      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'Status',

      align: 'center',
    },
    {
      title: 'DateTime',
      dataIndex: 'dateTime',

      align: 'center',
      render: (value, row, index) => {
        return <span>{value.replace('T', ' ').replace('Z', ' ')}</span>
      },
    },
    {
      title: 'Request DateTime',
      dataIndex: 'RequestDateTime',

      align: 'center',
      render: (value, row, index) => {
        return <span>{value.replace('T', ' ').replace('Z', ' ')}</span>
      },
    },
  ]

  return (
    <div>
      <h5 className="m-0">Import Loan binding CSV</h5>
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

export default LoanbindingCSV
