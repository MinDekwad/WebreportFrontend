import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Form,
  DatePicker,
  Input,
  Modal,
  Button,
  InputNumber,
  Card,
  Table,
  notification,
  Spin,
  Drawer,
  Descriptions,
  Tag,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import swal from 'sweetalert'
import * as dayjs from 'dayjs'
import moment from 'moment'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
//import axios from 'axios'

const today = dayjs().subtract(1, 'days').format('YYYY-MM-DD')

const Pointgen = () => {
  let history = useHistory()
  let dateValDetail

  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState(today)
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [limitPoint, setLimitPoint] = useState('')
  const [dataLimitPoint, setDataLimitPoint] = useState()
  const [dataLimitPointModal, setDataLimitPointModal] = useState()
  const [pointTransactionDetail, setPointTransactionDetail] = useState({})

  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const ChangeDate = (date, dateString) => {
    setDate(dateString)
  }

  const ChangeLimitPoint = (value) => {
    setLimitPoint(value)
  }

  const CalPoint = async () => {
    if (date === '') {
      swal({
        title: 'Error',
        text: 'Please select date',
        icon: 'error',
        button: 'close',
      })
      return
    }
    setLoading(true)
    try {
      // const axios = getAxios({ access_token })
      // const responDataCalPoint = await axios.post(
      //   `/api/v1/reports/point/calculatePoint?date=${date}&LimitPoint=${dataLimitPoint}`,
      // )

      const axios = getAxios({ access_token })
      const responDataCalPoint = await axios({
        method: 'post',
        url: `/api/v1/reports/point/calculatePoint?date=${date}&LimitPoint=${dataLimitPoint}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 200 * 1000,
      })

      const { data: DataCalPoint } = responDataCalPoint
      const { data: DataCalPoints } = DataCalPoint
      if (DataCalPoints === 'Error') {
        swal({
          title: 'Error',
          text: 'Cannot calculate point',
          icon: 'error',
          button: 'close',
        })
        return
      }
      if (DataCalPoints === 'Duplicate') {
        swal({
          title: 'Error',
          text: 'Data on this day has already, Please choose another day',
          icon: 'error',
          button: 'close',
        })
        return
      }
      if (DataCalPoints === 'ConsumerNoData') {
        swal({
          title: 'Error',
          text: 'No data on this day in consumer, Please choose another day',
          icon: 'error',
          button: 'close',
        })
        return
      }
      swal({
        title: 'Done!',
        text: 'Calculate point success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        history.push({
          pathname: '/Point/Pointhistory',
          search: `?date=${date}`,
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Calculate point transtion has error : ${message} `,
      })
    }
    setLoading(false)
  }

  const onEdit = (id) => {
    history.push({
      pathname: '/Point/Pointtransactionedit',
      search: '?id=' + id,
    })
  }

  const showModal = () => {
    setVisible(true)
    fetchDataLimitPoint()
  }
  const handleOk = async () => {
    if (limitPoint === '' || limitPoint === null || limitPoint <= 0) {
      swal({
        title: 'Error',
        text: 'Please insert limit point greater than 0',
        icon: 'error',
        button: 'close',
      })
      return
    }
    setConfirmLoading(true)
    try {
      const PostData = { limitPoint }
      const axios = getAxios({ access_token })
      const responseData = await axios.put(
        `/api/v1/reports/point/editLimitPoint?id=1`,
        PostData,
      )
      const data = responseData.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoading(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          fetchDataLimitPoint()
          setVisible(false)
          setConfirmLoading(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Save limit point error : ${message}`,
      })
      setConfirmLoading(false)
    }
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const fetchDataLimitPoint = useCallback(async () => {
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(`/api/v1/reports/point/limitPoint`)
      let { data } = responseData.data
      let limitPoint = data.LimitPoint
      setDataLimitPoint(limitPoint)
      setDataLimitPointModal(limitPoint)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get limit point error : ${message}`,
      })
    }
  }, [])

  const fetchDataTransactionList = useCallback(async () => {
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
    fetchDataLimitPoint()
    fetchDataTransactionList()
  }, [])

  const {
    TransactionName,
    TransactionType,
    PaymentChannel,
    PaymentType,
    DummyWallet,
    Expire,
    Amount,
    Point,
    StatusTransaction,
  } = pointTransactionDetail

  const columns = [
    {
      title: 'Transaction Name',
      dataIndex: 'TransactionName',
      align: 'left',
    },
    {
      title: 'Expiry Day',
      dataIndex: 'Expire',
      align: 'center',
      // render: (value) => {
      //   let dateVal = dayjs(value).format('YYYY-MM-DD')
      //   if (dateVal === '2001-01-01') {
      //     dateVal = 'None expire'
      //     return <span>{dateVal}</span>
      //   } else {
      //     return <span>{dateVal}</span>
      //   }
      // },
    },
    {
      title: 'Status',
      dataIndex: 'StatusTransaction',
      align: 'center',
      key: 'StatusTransaction',
      render: (value) => {
        return (
          <span>
            {value === 'Inactive' ? (
              <Tag color="volcano-inverse" style={{ margin: 'auto' }}>
                {value}
              </Tag>
            ) : (
              <Tag color="green-inverse" style={{ margin: 'auto' }}>
                {value}
              </Tag>
            )}
          </span>
        )
      },
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      align: 'right',
    },
    {
      title: 'Point',
      dataIndex: 'Point',
      align: 'right',
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
    {
      title: 'View Detail',
      key: 'x',
      align: 'center',
      render: (value, row, index) => {
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setPointTransactionDetail(value)
              setVisibleDrawer(true)
            }}
          ></Button>
        )
      },
    },
  ]

  return (
    <div>
      <Modal
        title="Insert number of limit point"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {/* <p>{modalText}</p> */}
        <InputNumber
          name="dataLimitPointModal"
          onChange={ChangeLimitPoint}
          defaultValue={dataLimitPointModal}
        />
      </Modal>

      <Drawer
        width={'25%'}
        title="Detail"
        placement="right"
        closable={true}
        onClose={() => {
          setVisibleDrawer(false)
        }}
        visible={visibleDrawer}
      >
        {pointTransactionDetail && (
          <Descriptions title="" column={1}>
            <Descriptions.Item label="Transaction Name">
              {TransactionName}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Type">
              {TransactionType}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Channel">
              {PaymentChannel}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Type">
              {PaymentType}
            </Descriptions.Item>
            <Descriptions.Item label="Dummy Wallet">
              {DummyWallet}
            </Descriptions.Item>
            <Descriptions.Item label="Expiry Day">{Expire}</Descriptions.Item>
            <Descriptions.Item label="Amount">{Amount}</Descriptions.Item>
            <Descriptions.Item label="Point">{Point}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {StatusTransaction}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Gen Point
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="form-group">
                  <div className="col-sm-12">
                    <Form name="frm_gen_point" layout="inline">
                      <Form.Item>
                        <DatePicker
                          onChange={ChangeDate}
                          defaultValue={moment(date)}
                        />
                      </Form.Item>
                      <Form.Item label="Limit point">
                        <Input
                          name="dataLimitPoint"
                          id="LimitPoint"
                          disabled
                          style={{
                            width: '50px',
                            border: 'none',
                            background: 'none',
                            color: 'red',
                            fontWeight: 'bold',
                          }}
                          value={dataLimitPoint}
                        />
                      </Form.Item>
                      <Button type="primary" onClick={showModal}>
                        Edit limit point
                      </Button>
                      &nbsp;
                      <Button
                        type="primary"
                        onClick={CalPoint}
                        style={{
                          float: 'left',
                          backgroundColor: '#52c41a',
                          border: '#52c41a',
                        }}
                      >
                        Calculate point
                      </Button>
                      &nbsp;
                      <p
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                        }}
                      >
                        * Calculate 1 time per day only
                      </p>
                    </Form>
                    <br />
                    <div className="row">
                      <div className="col-sm-12">
                        <Card
                          title="CONDITION TABLE TRANSACTION"
                          extra={
                            <Button
                              type="primary"
                              onClick={() => {
                                history.push({
                                  //pathname: '/Pointtransactionlist',
                                  pathname: '/Point/Pointtransactioncreate',
                                })
                              }}
                            >
                              {/* Edit */}Setup
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Pointgen
