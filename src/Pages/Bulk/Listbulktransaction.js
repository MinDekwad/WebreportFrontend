import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, Button, Card, Spin, notification } from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const Listbulktransaction = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [data, setData] = useState([])
  const [loading, setloading] = useState(true)

  const fetchData = useCallback(async () => {
    setloading(true)
    try {
      const axios = getAxios({ access_token })
      const responsBulkTransaction = await axios.get(
        //`/api/v1/reports/allBulkTransaction`,
        `/api/v1/reports/bulk/listBulkTransaction`,
      )

      let { data } = responsBulkTransaction.data
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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  let history = useHistory()
  const onEdit = (id) => {
    history.push({
      pathname: '/Bulk/Editbulktransaction',
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
      title: 'Date',
      dataIndex: 'dateTime',
      align: 'center',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD')}</span>
      },
    },
    {
      title: 'Bulk Credit Sameday',
      dataIndex: 'bulkCreditSameday',
      align: 'center',
      render: (value) => {
        return <span>{value.toLocaleString('en-US')}</span>
      },
    },
    {
      title: 'Bulk Credit Sameday Fee',
      dataIndex: 'bulkCreditSamedayFee',
      align: 'center',
      render: (value) => {
        return <span>{value.toLocaleString('en-US')}</span>
      },
    },
    {
      title: 'Transfer to bank account',
      dataIndex: 'transfertobankaccount',
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
                  Bulk Transaction
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
                      pathname: '/Bulk/Createbulktransaction',
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
export default Listbulktransaction
