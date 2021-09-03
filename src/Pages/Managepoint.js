import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { DatePicker } from 'antd'
import { Button } from 'antd'
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons'

const Managepoint = () => {
  let history = useHistory()

  const [date, setDate] = useState('')
  console.log(date)

  const onChangeDate = (date, dateString) => {
    setDate(dateString)
  }

  //const searchData = () => {}

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Manage Point
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
                    <div
                      className="col-sm-2 text-left"
                      style={{ float: 'left' }}
                    >
                      <label>Date</label>
                      <br />
                      <DatePicker onChange={onChangeDate} />
                    </div>

                    {/* <div
                      className="col-sm-1 text-left"
                      style={{ float: 'left' }}
                    >
                      <Button
                        className="btn btn-success"
                        type="primary"
                        onClick={() => {
                          searchData()
                        }}
                        // icon={<SearchOutlined />}
                        style={{ marginTop: '29px' }}
                      >
                        Search
                      </Button>
                    </div> */}

                    <div
                      className="col-sm-1 text-left"
                      style={{ float: 'left' }}
                    >
                      <Button
                        className="btn btn-success"
                        type="primary"
                        onClick={() => {
                          history.push({
                            pathname: '/Createlistpoint',
                          })
                        }}
                        // icon={<PlusCircleOutlined />}
                        style={{ marginTop: '29px' }}
                      >
                        Create
                      </Button>
                    </div>

                    <div style={{ clear: 'both' }}></div>
                    <br />
                    <div className="row">
                      <table
                        width="100%"
                        border="1"
                        cellPadding="5"
                        cellSpacing="5"
                      >
                        <thead>
                          <tr>
                            <td>Payment Type</td>
                            <td>Amount</td>
                            <td>Point</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>ไทยประกันสุขภาพ</td>
                            <td>1000</td>
                            <td>4</td>
                          </tr>
                          <tr>
                            <td>ไทยไพบูลย์ประกันภัย</td>
                            <td>250</td>
                            <td>1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div style={{ clear: 'both' }}></div>
                    <br />
                    <div className="row">
                      <div
                        className="col-sm-12 text-left"
                        style={{ float: 'left' }}
                      >
                        <Button className="btn btn-success" type="primary">
                          Gen Point
                        </Button>
                      </div>
                    </div>
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
export default Managepoint
