import React, { useState, useEffect, useCallback, useContext } from 'react'
import swal from 'sweetalert'
import { Table } from 'ant-table-extensions'
import { notification, Spin, Button } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { SaveOutlined } from '@ant-design/icons'

const AgentKycCSV = () => {
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
    fetchDataAgentKycName(filename)
  }

  const fetchDataAgentKycName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseAgentKycName = await axios.get(
        `/api/v1/reports/csv/agentKycFileName?filename=${filename}`,
      )
      const { data: CountAgentKycName } = responseAgentKycName
      const { data } = CountAgentKycName

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
        message: `(${status} Get file name agendkyc csv error : ${message})`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseAgentKycFileimport = await axios.get(
            `/api/v1/reports/csv/AgentKycFileimportStatus?filename=${filename}`,
          )
          const { data: AgentKycFileimport } = responseAgentKycFileimport
          const { data } = AgentKycFileimport
          let status = data.agent_kyc_fileimport_status
          let id = data.agent_kyc_fileimport_id
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
            message: `(${status})Get status file import agent kyc csv error : ${message}`,
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
      url: '/api/v1/reports/csv/upload/agentkyccsv',
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
      const responseAgentKycCSV = await axios.get(
        `/api/v1/reports/csv/AgentKycCSV?fileimportid=${id}`,
      )
      let {
        data: { data },
      } = responseAgentKycCSV
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
        message: `(${status}) Get data agent kyc csv error : ${message}`,
      })
    }
  }

  const columns = [
    {
      title: 'KYC Date',
      dataIndex: 'KYCDate',

      align: 'center',
    },
    {
      title: 'KYC Time',
      dataIndex: 'KYCTime',

      align: 'center',
    },
    {
      title: 'Agent ID',
      dataIndex: 'AgentID',

      align: 'center',
    },
    {
      title: 'Agent email',
      dataIndex: 'Agentemail',

      align: 'center',
    },
    {
      title: 'Agent Name Lastname',
      dataIndex: 'AgentNameLastname',

      align: 'center',
    },
    {
      title: 'KYC Status',
      dataIndex: 'KYCStatus',

      align: 'center',
    },
    {
      title: 'Consumer wallet id',
      dataIndex: 'Consumerwalletid',

      align: 'center',
    },
    {
      title: 'KYC Respond',
      dataIndex: 'KYCRespond',

      align: 'center',
    },
    {
      title: 'DOPA Respond',
      dataIndex: 'DOPARespond',

      align: 'center',
    },
  ]

  return (
    <div>
      <h5 className="m-0">Import Agent KYC CSV</h5>
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
export default AgentKycCSV
