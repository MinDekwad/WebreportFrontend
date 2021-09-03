import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import { DatePicker, Form, InputNumber, Button, Spin, notification } from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import * as moment from 'moment'

const dateFormat = 'YYYY-MM-DD 00:00:00'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Editbulktransaction = () => {
  const history = useHistory()
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const [loading, setLoading] = useState(false)
  const query = useQuery()
  const editId = query.get('id')
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
      const {
        data: { data: result },
      } = await axios.get(
        //`/api/v1/editbulktransaction/getBulktransactionEdit?id=${editId}`,
        `/api/v1/reports/bulk/bulktransaction?id=${editId}`,
      )
      setFormData(result)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data bulk transaction error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  const SaveData = async (values) => {
    const { dateTime } = values
    const dateTimeStr = dateTime.format(dateFormat)
    const dataPost = {
      ...values,
      dateTime: dateTimeStr,
    }
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const { data: resp } = await axios.put(
        `/api/v1/reports/bulk/saveEditBulkTransaction?id=${editId}`,
        dataPost,
      )
      const { message } = resp
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
          pathname: '/Bulk/Listbulktransaction',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Edit bulk transaction error : ${message}`,
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
                  Edit Bulk Transaction
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
                      name="form-edit-bulk"
                      onFinish={SaveData}
                      initialValues={{
                        ...formData,
                        dateTime: moment(formData.dateTime),
                      }}
                    >
                      <Form.Item
                        name="dateTime"
                        label="Date: "
                        rules={[{ required: true }]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>

                      <Form.Item
                        name="bulkCreditSameday"
                        label="Bulk Credit Same Day :"
                        rules={[{ required: true }]}
                      >
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        name="bulkCreditSamedayFee"
                        label="Bulk Credit Sameday fee : "
                        rules={[{ required: true }]}
                      >
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        name="transfertobankaccount"
                        label="Transfer To Bank Account : "
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
export default Editbulktransaction
