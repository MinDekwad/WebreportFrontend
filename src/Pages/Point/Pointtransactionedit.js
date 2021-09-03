import React, { useContext, useState, useCallback, useEffect } from 'react'
import {
  Form,
  notification,
  Input,
  Spin,
  Select,
  InputNumber,
  Button,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { useLocation, useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import * as dayjs from 'dayjs'

const { Option } = Select

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Pointtransactionedit = () => {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const [loading, setLoading] = useState(false)
  const query = useQuery()
  const editId = query.get('id')
  const history = useHistory()

  const [transacdtionTypes, setTransacdtionTypes] = useState()
  const [paymentChannels, setPaymentChannels] = useState()
  const [paymentTypes, setPaymentTypes] = useState()

  const [formData, setFormData] = useState(null)
  const [updateDate, setUpdateDate] = useState('')

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

  const fetchData = useCallback(async () => {
    if (editId === '') return
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responData = await axios.get(
        `/api/v1/reports/point/pointTransaction?id=${editId}`,
      )
      const { data } = responData.data
      //console.log(data)
      const updateDate = dayjs(data.UpdateDate).format('YYYY-MM-DD')
      setUpdateDate(updateDate)
      if (data.Expire === undefined) {
        data.Expire = 0
      }
      setFormData({
        transactionName: data.TransactionName,
        transactionType: data.TransactionType,
        paymentChannel: data.PaymentChannel,
        paymentType: data.PaymentType,
        dummyWallet: data.DummyWallet,
        amount: data.Amount,
        point: data.Point,
        expire: data.Expire,
        statusTransaction: data.StatusTransaction,
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data point transaction error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  const SavePointTransaction = async (values) => {
    const PostData = { ...values }
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.put(
        `/api/v1/reports/point/editConfigPoint?id=${editId}&date=${updateDate}`,
        PostData,
      )
      setLoading(false)
      const data = responseData.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setLoading(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        history.push({
          //pathname: 'Pointtransactionlist',
          pathname: 'Pointgen',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Edit point transacdtion error : ${message}`,
      })
    }
  }

  useEffect(() => {
    fetchData()
    fecthDataTransactionType()
    fecthDataPaymentChannel()
    fecthDataPaymentType()
  }, [])

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Config Earn Point
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <Spin spinning={loading} tip="loading..">
                {formData && (
                  <Form
                    {...layout}
                    name="frm-edit-transactionpoint"
                    onFinish={SavePointTransaction}
                    initialValues={{
                      ...formData,
                      //dummyWallet: '',
                    }}
                  >
                    <Form.Item
                      name="transactionName"
                      label="Transaction Name"
                      rules={[{ required: true }]}
                      style={{ width: '100%' }}
                    >
                      <Input />
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
                            //const { id, name } = d
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
                    <Form.Item
                      name="dummyWallet"
                      label="Dummy Wallet"
                      style={{ width: '100%' }}
                    >
                      <Input placeholder="105xxxxxxxxxxxx" />
                    </Form.Item>
                    <Form.Item
                      name="amount"
                      label="Amount"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="point"
                      label="Point"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      name="statusTransaction"
                      label="Status :"
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: '100%', textAlign: 'left' }}>
                        <Option key="Inactive">Inactive</Option>
                        <Option key="Active">Active</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="expire"
                      label="Expire"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        button
                        style={{ float: 'right' }}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Pointtransactionedit
