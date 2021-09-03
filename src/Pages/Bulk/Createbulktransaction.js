import React, { useState, useContext } from 'react'
import swal from 'sweetalert'
import * as dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Button,
  Spin,
  notification,
} from 'antd'
import moment from 'moment'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'

const today = dayjs().format('YYYY-MM-DD')
const dateFormat = 'YYYY-MM-DD 00:00:00'
let BulkCreditSamedayfeeValue

const Createbulktransaction = () => {
  const calculateBulkFee = (value) => {
    BulkCreditSamedayfeeValue = value * 20
    setBulkCreditSamedayfee(BulkCreditSamedayfeeValue)
  }

  const [BulkCreditSamedayfee, setBulkCreditSamedayfee] = useState(0)

  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [loading, setLoading] = useState(false)

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }
  const SaveBulk = (values) => {
    const { txDate } = values
    const date = txDate.format(dateFormat)

    const bulkcreditsamedayfee = parseInt(
      document.querySelector('#BulkCreditSamedayfee').value,
    )

    const formData = {
      ...values,
      txDate: date,
      BulkCreditSamedayfee: bulkcreditsamedayfee,
    }
    //console.log(formData)

    requestSave(
      formData.txDate,
      formData.BulkCreditSameday,
      formData.BulkCreditSamedayfee,
      formData.TransferToBankAccount,
    )
  }

  let history = useHistory()
  const requestSave = async (
    DateVal,
    BulkCreditSameday,
    BulkCreditSamedayfee,
    TransferToBankAccount,
  ) => {
    setLoading(true)
    try {
      let PostData = {
        date_time: DateVal,
        bulk_credit_sameday: BulkCreditSameday,
        bulk_credit_sameday_fee: BulkCreditSamedayfee,
        transfertobankaccount: TransferToBankAccount,
      }
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/bulk/createBulkTransaction`,
        PostData,
      )
      setLoading(false)
      console.log('responseData create bulk', responseData)
      const data = responseData.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          description: message,
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
          pathname: '/Bulk/Listbulktransaction',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Create bulk transaction error : ${message}`,
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
                  Create Bulk Transaction
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
                    name="form-crate-bulk"
                    onFinish={SaveBulk}
                    initialValues={{
                      BulkCreditSameday: 0,
                      //BulkCreditSamedayfee: 0,
                      TransferToBankAccount: 0,
                    }}
                  >
                    <Form.Item
                      name="txDate"
                      label="Date :"
                      rules={[{ required: true }]}
                    >
                      <DatePicker id="txtDate" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="BulkCreditSameday"
                      label="Bulk Credit Same Day :"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    {/* <Form.Item
                      name="BulkCreditSamedayfee"
                      label="Bulk Credit Sameday fee : "
                      rules={[{ required: true }]}
                      initialValues={BulkCreditSamedayfee}
                      value={BulkCreditSamedayfee}
                      values={BulkCreditSamedayfee}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                      />
                      {BulkCreditSamedayfee}
                    </Form.Item> */}

                    <Form.Item
                      //name="BulkCreditSamedayfee"
                      label="Bulk Credit Sameday fee : "
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        defaultValue={BulkCreditSamedayfee}
                        value={BulkCreditSamedayfee}
                        id="BulkCreditSamedayfee"
                      />
                    </Form.Item>

                    <Form.Item
                      name="TransferToBankAccount"
                      label="Transfer To Bank Account : "
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        onChange={calculateBulkFee}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        loading={loading}
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
export default Createbulktransaction
