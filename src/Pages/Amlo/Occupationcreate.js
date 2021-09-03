import React, { useState, useContext } from 'react'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { Form, Input, Button, notification, Select, Spin } from 'antd'
import swal from 'sweetalert'
import { useHistory } from 'react-router-dom'
import * as dayjs from 'dayjs'

const { Option } = Select
const today = dayjs().format('YYYY-MM-DD')

const Occupationcreate = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  let history = useHistory()
  const [loading, setLoading] = useState(false)

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const SaveOccupation = (values) => {
    const formData = { ...values }
    SaveData(formData.occupationName, formData.rank)
  }
  const SaveData = async (occupationName, rank) => {
    setLoading(true)
    try {
      let PostData = {
        OccupationName: occupationName,
        Rank: rank,
      }
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/createOccupation?date=${today}`,
        PostData,
      )
      setLoading(false)
      let { data } = responseData.data
      if (data === 'Dup') {
        swal({
          title: 'Error',
          text: 'Duplicate occupation',
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
          pathname: 'Occupation',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Create occupation error : ${message}`,
      })
      setLoading(false)
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
                  Create Occupation
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
                <Form
                  {...layout}
                  name="frm-crate-occupation"
                  onFinish={SaveOccupation}
                  initialValues={{
                    rank: '1',
                  }}
                >
                  <Form.Item
                    name="occupationName"
                    label="Occupation Name"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="rank"
                    label="Rank :"
                    rules={[{ required: true }]}
                  >
                    <Select style={{ width: '100%', textAlign: 'left' }}>
                      <Option key="1">1</Option>
                      <Option key="2">2</Option>
                      <Option key="3">3</Option>
                    </Select>
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
  )
}
export default Occupationcreate
