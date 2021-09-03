import React, { useCallback, useState, useContext } from 'react'
import swal from 'sweetalert'
import * as dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import {
  DatePicker,
  Form,
  InputNumber,
  Button,
  Spin,
  Select,
  notification,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'

const dateFormat = 'YYYY-MM-DD 00:00:00'
const { Option } = Select

const Createstatementending = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [loading, setLoading] = useState(false)

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  let history = useHistory()

  const requestSave = async (DateVal, StatementEndingBalance, BankID) => {
    setLoading(true)
    try {
      let PostData = {
        Statement_Date: DateVal,
        Statement_Balance: StatementEndingBalance,
        Bank_UID: BankID,
      }
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/statementending/createStatementEndingBalance`,
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
          pathname: '/Statement/Liststatementending',
        })
      })
    } catch (error) {
      const { status, message } = getErrorMessage(error)
      notification.warn({
        message: `(${status}) Create statement ending balance error : ${message}`,
      })
    }
    setLoading(false)
  }

  const SaveStatementEnding = (values) => {
    const { txDate } = values
    const date = txDate.format(dateFormat)
    const formData = { ...values, txDate: date }

    var BankID = parseInt(formData.BankID, 10)

    requestSave(formData.txDate, formData.StatementEndingBalance, BankID)
  }
  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Create Statement Ending Balance
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
                    name="form-crate-statementend"
                    onFinish={SaveStatementEnding}
                    initialValues={{
                      StatementEndingBalance: 0,
                      BankID: '2',
                    }}
                  >
                    <Form.Item
                      name="txDate"
                      label="Date :"
                      rules={[{ required: true }]}
                    >
                      <DatePicker id="txtDate" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="BankID" label="Bank Account :">
                      <Select
                        //defaultValue="2"
                        style={{ width: '100%', textAlign: 'left' }}
                      >
                        <Option key="2">777-2-38735-5</Option>
                        <Option key="4">777-2-38736-0</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="StatementEndingBalance"
                      label="Statement Ending Balance:"
                      rules={[{ required: true }]}
                    >
                      <InputNumber style={{ width: '100%' }} />
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
export default Createstatementending
