import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, Button, Card, Spin, notification } from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { EditOutlined } from '@ant-design/icons'
import * as dayjs from 'dayjs'

const Liststatementending = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responsEndingBalance = await axios.get(
        //`/api/v1/reports/allStatementEndingBalance`,
        // `/api/v1/reports/listStatementEndingBalance`,
        `/api/v1/reports/statementending/listStatementEndingBalance`,
      )

      let { data } = responsEndingBalance.data
      console.log(data)
      data = data.map((d, i) => {
        const { edges } = d || { edges: {} }
        const { bank } = edges || { bank: {} }
        return {
          ...bank,
          key: `${i}`,
          ...d,
        }
      })

      setData(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data statement ending balance error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  let history = useHistory()
  const onEdit = (id) => {
    history.push({
      pathname: '/Statement/Editstatementending',
      search: '?id=' + id,
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'left',
    },
    {
      title: 'Bank Account',
      dataIndex: 'Bank_AccountNo',
      width: 250,
      align: 'center',
    },
    {
      title: 'Balance',
      dataIndex: 'Statement_Balance',
      align: 'center',
      render: (value) => {
        return <span>{value.toLocaleString('en-US')}</span>
      },
    },
    {
      title: 'Date',
      dataIndex: 'Statement_Date',
      width: 250,
      align: 'center',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD')}</span>
      },
    },
    {
      title: 'Edit',
      width: 250,
      key: 'Edit',
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(e) => {
            onEdit(record.id, e)
          }}
        ></Button>
      ),
    },
  ]

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Statement Ending Balance
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <Card
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    history.push({
                      pathname: '/Statement/Createstatementending',
                    })
                  }}
                >
                  Create
                </Button>
              }
            >
              {
                <Spin spinning={loading} tip="Loading">
                  <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{ y: '57vh' }}
                  />
                </Spin>
              }
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Liststatementending
