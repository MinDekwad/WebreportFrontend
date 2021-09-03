import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import { Form, Input, Button, InputNumber } from 'antd'
import { notification } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'

const Createconfigpoint = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [loading, setLoading] = useState(false)
  let history = useHistory()

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const SaveConfigPoint = (values) => {
    //console.log(values)
    const formData = { ...values }

    SaveData(
      formData.paymentType,
      formData.toAccountNo,
      formData.toAccountName,
      formData.amountPerPoint,
    )
  }

  const SaveData = async (
    paymentType,
    toAccountNo,
    toAccountName,
    amountPerPoint,
  ) => {
    setLoading(true)
    try {
      let PostData = {
        PaymentType: paymentType,
        ToAccountNo: toAccountNo,
        ToAccountName: toAccountName,
        AmountPerPoint: amountPerPoint,
      }
      console.log(PostData)
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/point/createConfigPoint`,
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
          pathname: 'Configpoint',
        })
      })
    } catch (error) {
      const { status, message } = getErrorMessage(error)
      notification.warn({
        message: `(${status}) Create config point error : ${message}`,
      })
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Create config point
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <Form
                  {...layout}
                  name="form-crate-configpoint"
                  onFinish={SaveConfigPoint}
                >
                  {/* <Form.Item
                    name="transactionType"
                    label="Transaction Type"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <Input />
                  </Form.Item> */}
                  <Form.Item
                    name="paymentType"
                    label="Payment Type"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="toAccountNo"
                    label="To Account No"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <Input placeholder="105xxxxxxxxxxxx" />
                  </Form.Item>
                  <Form.Item
                    name="toAccountName"
                    label="To Account Name"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <Input placeholder="ไทยประกันสุขภาพ" />
                  </Form.Item>

                  <Form.Item
                    name="amountPerPoint"
                    label="Set amount per point : "
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Createconfigpoint
