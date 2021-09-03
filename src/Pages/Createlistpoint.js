import React from 'react'
import { Form, Input, Button, InputNumber, Select } from 'antd'

const { Option } = Select

const Createpoint = () => {
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const SaveCreateListPoint = () => {}

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Create List Point
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
                  name="form-crate-list-point"
                  onFinish={SaveCreateListPoint}
                >
                  {/* <label>Payment Type</label>
                  <select>
                    <option>ไทยประกันสุขภาพ</option>
                    <option>ไทยไพบูลย์ประกันภัย</option>
                  </select> */}

                  <Form.Item name="PaymentType" label="Payment Type :">
                    <Select style={{ width: '100%', textAlign: 'left' }}>
                      <Option key="ไทยประกันสุขภาพ">ไทยประกันสุขภาพ</Option>
                      <Option key="ไทยไพบูลย์ประกันภัย">
                        ไทยไพบูลย์ประกันภัย
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="Amount"
                    label="Amount"
                    rules={[{ required: true }]}
                    style={{ width: '100%' }}
                  >
                    <Input />
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
export default Createpoint
