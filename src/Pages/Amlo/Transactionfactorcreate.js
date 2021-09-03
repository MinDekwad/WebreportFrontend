import React, { useContext, useEffect, useState, useCallback } from 'react'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  notification,
  Spin,
  Popconfirm,
  InputNumber,
  Modal,
} from 'antd'
import swal from 'sweetalert'
import { useHistory } from 'react-router-dom'
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'

const { Option } = Select

const Transactionfactorcreate = () => {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  let history = useHistory()
  const [loading, setLoading] = useState(false)

  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [data, setData] = useState([])
  //const [loading, setLoading] = useState(true)
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)

  const [transacdtionTypes, setTransacdtionTypes] = useState()
  const [paymentChannels, setPaymentChannels] = useState()
  const [paymentTypes, setPaymentTypes] = useState()

  const [transactionFactorName, setTransactionFactorName] = useState('')
  const [day, setDay] = useState()

  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [rank, setRank] = useState('')

  const [trasacItemTmp, setTrasacItemTmp] = useState()
  const [confirmLoadingDel, setConfirmLoadingDel] = React.useState(false)

  const ChangeMin = (value) => {
    setMin(value)
  }
  const ChangeMax = (value) => {
    setMax(value)
  }
  const ChangeRank = (value) => {
    setRank(value)
  }

  const fecthDataTransactionType = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseTransactionType = await axios.get(
      //   `/api/v1/reports/point/transactionType`,
      // )
      const responseTransactionType = await axios({
        method: 'get',
        url: `/api/v1/reports/point/transactionType`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: transactionType } = responseTransactionType
      const { data: transactionTypes } = transactionType
      setTransacdtionTypes(transactionTypes)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data transaction type error : ${message}`,
      })
    }
  }

  const fecthDataPaymentChannel = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responsePaymentChannel = await axios.get(
      //   `/api/v1/reports/point/paymentChannel`,
      // )
      const responsePaymentChannel = await axios({
        method: 'get',
        url: `/api/v1/reports/point/paymentChannel`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: paymentChannel } = responsePaymentChannel
      const { data: paymentChannels } = paymentChannel
      setPaymentChannels(paymentChannels)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data payment channel error ${message}`,
      })
    }
  }

  const fecthDataPaymentType = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responsePaymentType = await axios.get(
      //   `/api/v1/reports/point/paymentType`,
      // )
      const responsePaymentType = await axios({
        method: 'get',
        url: `/api/v1/reports/point/paymentType`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: paymentType } = responsePaymentType
      const { data: paymentTypes } = paymentType
      setPaymentTypes(paymentTypes)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data payment type error ${message}`,
      })
    }
  }

  const AddAnotherItem = () => {
    setVisible(true)
  }
  const handleOk = async () => {
    if (min === '' || min < 1) {
      swal({
        title: 'Error',
        text: 'Please insert min geter then 1',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (max === '' || max < 0) {
      swal({
        title: 'Error',
        text: 'Please insert max',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (rank === '' || rank <= 0 || rank > 3) {
      swal({
        title: 'Error',
        text: 'Please insert rank to correct',
        icon: 'error',
        button: 'close',
      })
      return
    }
    setConfirmLoading(true)
    try {
      let PostData = {
        Min: min,
        Max: max,
        Rank: rank,
      }
      const axios = getAxios({ access_token })
      const responseDataTrasacItemTmp = await axios.put(
        `/api/v1/reports/amlo/createTransactionFactorItemTmp`,
        PostData,
      )
      const data = responseDataTrasacItemTmp.data
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
          fetchDataTrasacItemTmp()
          setVisible(false)
          setConfirmLoading(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Save transaction item error : ${message}`,
      })
      setConfirmLoading(false)
    }
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const SaveTransactionFactor = (values) => {
    if (min === '') {
      swal({
        title: 'Error',
        text: 'Please add transaction',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (max === '') {
      swal({
        title: 'Error',
        text: 'Please add transaction',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (rank === '') {
      swal({
        title: 'Error',
        text: 'Please add transaction',
        icon: 'error',
        button: 'close',
      })
      return
    }
    const formData = { ...values }

    SaveData(
      formData.transactionFactorName,
      formData.transactionType,
      formData.paymentChannel,
      formData.paymentType,
      formData.day,
    )
  }

  const SaveData = async (
    transactionFactorName,
    transactionType,
    paymentChannel,
    paymentType,
    day,
  ) => {
    setLoading(true)
    try {
      let PostData = {
        TransactionFactorName: transactionFactorName,
        TransactionType: transactionType,
        PaymentChannel: paymentChannel,
        PaymentType: paymentType,
        Day: day,
      }
      //console.log(PostData)
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/createTransactionFactor`,
        PostData,
      )
      setLoading(false)
      let { data } = responseData.data
      if (data === 'Dup') {
        swal({
          title: 'Error',
          text: 'Duplicate with this type',
          icon: 'error',
          button: 'close',
        })
        return false
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        history.push({
          pathname: '/Amlo/Transactionfactor',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Create point transacdtion error : ${message}`,
      })
    }
  }

  const fetchDataTrasacItemTmp = useCallback(async () => {
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/amlo/dataTrasacItemTmp`,
      )
      let { data } = responseData.data
      console.log(data)
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setTrasacItemTmp(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get transaction factor temp item error : ${message}`,
      })
    }
  }, [])

  const onDel = async (id) => {
    setConfirmLoadingDel(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/delTransactionFactorItemTmpPer?id=${id}`,
      )

      const data = responseData.data
      const message = data.message

      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoadingDel(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          fetchDataTrasacItemTmp()
          setVisible(false)
          setConfirmLoadingDel(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Delete occupation data has error : ${message} `,
      })
    }
  }

  const columns = [
    {
      title: 'MIN',
      dataIndex: 'Min',
      width: '33%',
    },
    {
      title: 'MAX',
      dataIndex: 'Max',
      width: '33%',
    },
    {
      title: 'Rank',
      dataIndex: 'Rank',
      width: '33%',
    },
  ]

  useEffect(() => {
    fecthDataTransactionType()
    fecthDataPaymentChannel()
    fecthDataPaymentType()
  }, [])

  return (
    <div>
      <Modal
        title="Insert min, max and rank"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form.Item name="min" label="MIN" style={{ width: '100%' }}>
          <InputNumber style={{ width: '100%' }} onChange={ChangeMin} />
        </Form.Item>
        &nbsp;
        <Form.Item name="max" label="MAX" style={{ width: '100%' }}>
          <InputNumber style={{ width: '100%' }} onChange={ChangeMax} />
        </Form.Item>
        &nbsp;
        <Form.Item name="rank" label="Rank" style={{ width: '100%' }}>
          <InputNumber style={{ width: '100%' }} onChange={ChangeRank} />
        </Form.Item>
      </Modal>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <Form
                  {...layout}
                  name="frm_transactionfactorcreate"
                  style={{ textAlign: 'left' }}
                  onFinish={SaveTransactionFactor}
                >
                  {/* <div className="col-sm-6"> */}
                  <Form.Item
                    name="transactionFactorName"
                    label="Transactionfactor Name"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="day"
                    label="Day(number)"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    name="transactionType"
                    label="Transaction Type"
                    rules={[{ required: true }]}
                    style={{ width: '100%', textAlign: 'left' }}
                  >
                    <Select>
                      {transacdtionTypes &&
                        transacdtionTypes.map((d) => {
                          return <Option key={d}>{d}</Option>
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="paymentChannel"
                    label="Payment Channel"
                    rules={[{ required: true }]}
                    style={{ width: '100%', textAlign: 'left' }}
                  >
                    <Select>
                      {paymentChannels &&
                        paymentChannels.map((d) => {
                          return <Option key={d}>{d}</Option>
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="paymentType"
                    label="Payment Type"
                    rules={[{ required: true }]}
                    style={{ width: '100%', textAlign: 'left' }}
                  >
                    <Select>
                      {paymentTypes &&
                        paymentTypes.map((d) => {
                          return <Option key={d}>{d}</Option>
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        AddAnotherItem()
                      }}
                    >
                      Add another item
                    </Button>
                    &nbsp;
                    <Button type="primary" htmlType="submit" button>
                      Submit
                    </Button>
                  </Form.Item>
                  {/* </div> */}
                  {/* <div class="clear"></div> */}
                  <div className="col-sm-12">
                    <Table
                      columns={columns}
                      dataSource={trasacItemTmp}
                      scroll={{ y: '57vh' }}
                    />
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Transactionfactorcreate
