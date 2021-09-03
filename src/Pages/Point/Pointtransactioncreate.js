import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import {
  Form,
  Input,
  Button,
  InputNumber,
  notification,
  Select,
  Spin,
} from 'antd'
//import axios from 'axios'
import swal from 'sweetalert'
import { useHistory } from 'react-router-dom'
import * as dayjs from 'dayjs'

const { Option } = Select
const today = dayjs().format('YYYY-MM-DD')

const Pointtransactioncreate = () => {
  let history = useHistory()
  const [loading, setLoading] = useState(false)

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [transacdtionTypes, setTransacdtionTypes] = useState()
  const [paymentChannels, setPaymentChannels] = useState()
  const [paymentTypes, setPaymentTypes] = useState()

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

  useEffect(() => {
    fecthDataTransactionType()
    fecthDataPaymentChannel()
    fecthDataPaymentType()
  }, [])

  const SavePointTransaction = (values) => {
    //console.log(values)
    const formData = { ...values }

    SaveData(
      formData.transactionName,
      formData.transactionType,
      formData.paymentChannel,
      formData.paymentType,
      formData.dummyWallet,
      formData.amount,
      formData.point,
      formData.statusTransaction,
      formData.expire,
    )
  }

  const SaveData = async (
    transactionName,
    transactionType,
    paymentChannel,
    paymentType,
    dummyWallet,
    amount,
    point,
    statusTransaction,
    expire,
  ) => {
    setLoading(true)
    try {
      let PostData = {
        TransactionName: transactionName,
        TransactionType: transactionType,
        PaymentChannel: paymentChannel,
        PaymentType: paymentType,
        DummyWallet: dummyWallet,
        Amount: amount,
        Point: point,
        StatusTransaction: statusTransaction,
        Expire: expire,
      }
      //console.log(PostData)
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/point/createConfigPoint?date=${today}`,
        PostData,
      )
      setLoading(false)
      //const data = responseData.data
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
          //pathname: 'Pointtransactionlist',
          pathname: 'Pointgen',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Create point transacdtion error : ${message}`,
      })
    }
  }

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

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <Spin spinning={loading} tip="loading..">
                  <Form
                    {...layout}
                    name="frm-crate-transactionpoint"
                    onFinish={SavePointTransaction}
                    initialValues={{
                      dummyWallet: '',
                      statusTransaction: 'Inactive',
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
                      <Input />
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
                      extra="Insert numuric for calculate expire date"
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
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Pointtransactioncreate
