import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import swal from 'sweetalert'
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
import * as moment from 'moment'
const { Option } = Select
const dateFormat = 'YYYY-MM-DD 00:00:00'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Editstatementending = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [loading, setLoading] = useState(false)

  const query = useQuery()
  const editId = query.get('id')

  const history = useHistory()
  const [formData, setFormData] = useState(null)

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const fetchData = useCallback(async () => {
    if (editId === '') return
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const { data } = await axios.get(
        // `/api/v1/editstatementendingbalance/getStatementEndingBalanceEdit?id=${editId}`,
        `/api/v1/reports/statementending/statementendingbalance?id=${editId}`,
      )
      let {
        data: {
          Statement_Date: statementDate,
          edges,
          Statement_Balance: statementBalance,
        },
        id,
      } = data
      let BankID = edges.bank.id

      setFormData({
        uid: id,
        bankId: BankID,
        day: moment(statementDate),
        balance: statementBalance,
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data statemending ending balance error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  const SaveEditStatementEnding = (values) => {
    const { day } = values
    const date = day.format(dateFormat)
    const { bankId, balance } = values
    const input = {
      id: editId,
      Statement_Date: date,
      Statement_Balance: balance,
      Bank_UID: parseInt(bankId, 10),
    }
    requestSave(input)
  }

  const requestSave = async (input) => {
    const { id, ...dataPost } = input
    setLoading(true)

    try {
      const axios = getAxios({ access_token })
      let response = await axios.put(
        `/api/v1/reports/statementending/saveEditStatementEndingBalance?id=${id}`,
        dataPost,
      )
      let data = response.data
      let message = data.message
      if (message !== 'success') {
        notification.warn({
          message: 'Something went wrong',
          description: message,
        })
        setLoading(false)
        return
      }

      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'Close',
      }).then(() => {
        history.push({
          pathname: '/Statement/Liststatementending',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Edit statemet ending balance error : ${message}`,
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Edit Statement Ending Balance
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
                  {formData && (
                    <Form
                      {...layout}
                      name="form-edit-statementend"
                      onFinish={SaveEditStatementEnding}
                      initialValues={{
                        ...formData,
                        bankId: formData.bankId.toString(),
                      }}
                    >
                      <Form.Item
                        name="day"
                        label="Date: "
                        rules={[{ required: true }]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>

                      <Form.Item name="bankId" label="Bank Account :">
                        <Select style={{ width: '100%', textAlign: 'left' }}>
                          <Option key="2">777-2-38735-5</Option>
                          <Option key="4">777-2-38736-0</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="balance"
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
                  )}
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Editstatementending
