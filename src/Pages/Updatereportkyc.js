import React, { useState, useContext } from 'react'
import swal from 'sweetalert'
import { Form, DatePicker, Button, notification, Spin, Result } from 'antd'
import { getAxios, getErrorMessage } from '../Services'
import { UserContext } from '../userContext'

const Updatereport = () => {
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const handleChangeDate = (date, dateString) => {
    setDate(dateString)
  }

  const UpdateReport = async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })

      const responseData = await axios({
        method: 'post',
        url: `/api/v1/reports/updateKyc?date=${date}`,
        timeout: 90 * 1000,
      })
      let { data } = responseData.data
      if (data === 'success') {
        swal({
          title: 'Done!',
          text: 'Update Success',
          icon: 'success',
          button: 'close',
        })
      }
      setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Update report kyc has error : ${message}`,
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
                  Update Report KYC
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
                  <div
                    className="col-sm-12 text-left"
                    style={{ float: 'left' }}
                  >
                    <Form
                      name="UpdateReport"
                      layout="inline"
                      onFinish={UpdateReport}
                    >
                      <Form.Item name="date">
                        <DatePicker id="txtDate" onChange={handleChangeDate} />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          disabled={!date ? true : false}
                          type="primary"
                          htmlType="submit"
                          button
                          style={{ float: 'right' }}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                    <Spin spinning={loading}>
                      <Result title="No preview data" />
                    </Spin>
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
export default Updatereport
