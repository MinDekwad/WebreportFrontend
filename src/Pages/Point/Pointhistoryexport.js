import React, { useContext, useState, useEffect } from 'react'
import { Form, DatePicker, Button, notification, Table } from 'antd'
import moment from 'moment'
import * as dayjs from 'dayjs'
import { getAxios, getErrorMessage } from '../../Services'
import { UserContext } from '../../userContext'
import swal from 'sweetalert'

const { RangePicker } = DatePicker
let prevday = dayjs().subtract(1, 'days').format('YYYY-MM-DD')
let today = dayjs().format('YYYY-MM-DD')
const dateFormat = 'YYYY-MM-DD'

const Pointhistoryexport = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  let start_date = ''
  let end_date = ''

  const [data, setData] = useState([])
  const [date, setDate] = useState([prevday, today])

  const ChangeDate = (date, dateString) => {
    setDate(dateString)
  }
  const searchData = async () => {
    start_date = date[0]
    end_date = date[1]

    if (
      start_date === null ||
      end_date === null ||
      start_date === '' ||
      end_date === ''
    ) {
      swal({
        title: 'Error',
        text: 'Please choose period',
        icon: 'error',
        button: 'close',
      })
      return false
    }

    try {
      // start_date = date[0]
      // end_date = date[1]
      const axios = getAxios({ access_token })
      const responseHistoryPointExport = await axios.get(
        `/api/v1/reports/point/historyPointExport?start_date=${start_date}&end_date=${end_date}`,
      )
      let { data } = responseHistoryPointExport.data
      if (data === null) {
        setData([])
        return false
      }
      data = data.map((d, i) => {
        return {
          ...d,
        }
      })
      setData(data)
    } catch (err) {
      const { message, status } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get history point export has error : ${message}`,
      })
    }
  }

  const columns = [
    {
      title: 'User',
      dataIndex: 'UserName',
      align: 'center',
    },
    {
      title: 'File Name',
      dataIndex: 'FileName',
      align: 'center',
    },
    {
      title: 'Export Date',
      dataIndex: 'ExportDate',
      align: 'center',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD')}</span>
      },
    },
  ]

  useEffect(() => {
    searchData()
  }, [])

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  History export
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
                  <div className="col-sm-12">
                    <Form name="frm_history_point" layout="inline">
                      <Form.Item>
                        <RangePicker
                          id="txtDate"
                          onChange={ChangeDate}
                          defaultValue={[
                            moment(prevday, dateFormat),
                            moment(today, dateFormat),
                          ]}
                          format={dateFormat}
                        />
                      </Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          searchData()
                        }}
                      >
                        Search
                      </Button>
                    </Form>
                    <br />
                    <div className="row">
                      <div style={{ width: '100%' }}>
                        {/* <Table
                          columns={columns}
                          dataSource={data}
                          scroll={{ y: '57vh' }}
                        /> */}
                        {data && <Table columns={columns} dataSource={data} />}
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
export default Pointhistoryexport
