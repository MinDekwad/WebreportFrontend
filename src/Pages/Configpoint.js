import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory } from 'react-router'
import { Button, Card, notification, Table, Spin } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { EditOutlined } from '@ant-design/icons'

const Configpoint = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [data, setData] = useState([])
  const [loading, setloading] = useState(true)

  let history = useHistory()

  const fetchData = useCallback(async () => {
    setloading(true)
    try {
      const axios = getAxios({ access_token })
      const responsConfigPoint = await axios.get(
        `/api/v1/reports/point/listConfigPoint`,
      )

      let { data } = responsConfigPoint.data
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
        message: `(${status}) Get all data bulk transaction error : ${message}`,
      })
    }

    setloading(false)
  }, [])

  const onEdit = () => {}

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns = [
    {
      title: 'Payment Type',
      dataIndex: 'PaymentType',
      align: 'left',
    },
    {
      title: 'To Account No',
      dataIndex: 'ToAccountNo',
      align: 'left',
    },
    {
      title: 'To Account Name',
      dataIndex: 'ToAccountName',
      align: 'left',
    },
    {
      title: 'Amount Per Point',
      dataIndex: 'AmountPerPoint',
      align: 'center',
      render: (value) => {
        return <span>{value.toLocaleString('en-US')}</span>
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
                  Config Point
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
                      pathname: '/Createconfigpoint',
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
export default Configpoint
