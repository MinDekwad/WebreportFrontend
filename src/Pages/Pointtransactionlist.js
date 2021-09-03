import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Button, Table, notification, Spin } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'

const Pointtransactionlist = () => {
  let history = useHistory()

  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const onEdit = (id) => {
    history.push({
      pathname: '/Pointtransactionedit',
      search: '?id=' + id,
    })
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/point/pointTransactionList`,
      )
      let { data } = responseData.data
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
        message: `(${status}) Get all data point transaction error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns = [
    {
      title: 'Transaction Name',
      dataIndex: 'TransactionName',
    },
    {
      title: 'Transaction Type',
      dataIndex: 'TransactionType',
    },
    {
      title: 'Payment Channel',
      dataIndex: 'PaymentChannel',
    },
    {
      title: 'Payment Type',
      dataIndex: 'PaymentType',
    },
    {
      title: 'Dummy Wallet',
      dataIndex: 'DummyWallet',
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
    },
    {
      title: 'Point',
      dataIndex: 'Point',
    },
    {
      title: 'Edit',
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
                  Transaction List
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <Card
              title="CONDITION TABLE TRANSACTION"
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    history.push({
                      pathname: '/Pointtransactioncreate',
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
export default Pointtransactionlist
