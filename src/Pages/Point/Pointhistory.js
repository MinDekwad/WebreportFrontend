import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  Form,
  DatePicker,
  Button,
  Table,
  notification,
  Modal,
  Input,
  InputNumber,
} from 'antd'
import { getAxios, getErrorMessage } from '../../Services'
import { UserContext } from '../../userContext'
import * as dayjs from 'dayjs'
import swal from 'sweetalert'
import { Parser } from 'json2csv'
import moment from 'moment'

const { RangePicker } = DatePicker
const { TextArea } = Input

// let prevday = ''
// let today = ''
let prevday = dayjs().subtract(1, 'days').format('YYYY-MM-DD')
let today = dayjs().format('YYYY-MM-DD')
const dateFormat = 'YYYY-MM-DD'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Pointhistory = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user
  //console.log('userData : ', userData)
  let history = useHistory()
  let start_date = ''
  let end_date = ''
  const query = useQuery()
  let dates = query.get('date')
  //console.log('date query : ', dates)
  if (dates !== null) {
    prevday = dates
    today = dates
  }
  const [data, setData] = useState()
  // const [date, setDate] = useState([null, null])
  const [date, setDate] = useState([prevday, today])
  //console.log('change date : ', date)
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [note, setNote] = useState('')

  const ChangeDate = (date, dateString) => {
    setDate(dateString)
  }

  const ChangeNote = (value) => {
    setNote(value)
  }

  const searchData = async () => {
    try {
      start_date = date[0]
      end_date = date[1]

      //console.log('start date before : ', start_date)
      //console.log('end date before : ', end_date)

      if (start_date === null || start_date === '') {
        start_date = prevday
        //console.log('case1')
      }
      if (end_date === null || end_date === '') {
        end_date = today
        //console.log('case2')
      }
      if (dates !== null) {
        start_date = dates
        end_date = dates
        //console.log('case3')
      }

      //console.log('start date after : ', start_date)
      //console.log('end date after : ', end_date)

      const axios = getAxios({ access_token })
      const respPointhistory = await axios.get(
        `/api/v1/reports/point/historyPoint?start_date=${start_date}&end_date=${end_date}`,
      )
      let { data } = respPointhistory.data
      data = data.map((d, i) => {
        return {
          ...d,
        }
      })
      setData(data)
    } catch (err) {
      const { message, status } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data point history has error : ${message}`,
      })
    }
  }

  const showModalExport = () => {
    start_date = date[0]
    end_date = date[1]

    if (start_date === null || end_date === null) {
      swal({
        title: 'Error',
        text: 'Please choose period date',
        icon: 'error',
        button: 'close',
      })
      return false
    }
    setVisible(true)
  }
  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      start_date = date[0]
      end_date = date[1]
      // const axios = getAxios({ access_token })
      // const responseCreatePointCsv = await axios.get(
      //   `/api/v1/reports/point/createPointCSV?start_date=${start_date}&end_date=${end_date}&note=${note}`,
      // )

      const axios = getAxios({ access_token })
      const responseCreatePointCsv = await axios({
        method: 'get',
        url: `/api/v1/reports/point/createPointCSV?start_date=${start_date}&end_date=${end_date}&note=${note}&user=${userData}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 200 * 1000,
      })

      const { data: CreatePointCsv } = responseCreatePointCsv.data
      if (CreatePointCsv === 'Error') {
        swal({
          title: 'Error',
          text: 'Cannot export csv',
          icon: 'error',
          button: 'close',
        })
        setVisible(false)
        setConfirmLoading(false)
        return
      }
      if (CreatePointCsv === 'NoData') {
        swal({
          title: 'Error',
          text: 'No data on this period',
          icon: 'error',
          button: 'close',
        })
        setVisible(false)
        setConfirmLoading(false)
        return
      }

      const respExportPointCsv = await axios.get(
        `/api/v1/reports/point/exportPointCSV?start_date=${start_date}&end_date=${end_date}`,
      )
      let { data } = respExportPointCsv.data
      //console.log('data exp return : ', data)
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
          //Adjustamount: d.sum,
          walletId: d.WalletID,
          adjustamount: d.Adjustamount,
          note: d.Note,
        }
      })
      const start_date_export = dayjs(start_date).format('YYYY_MM_DD')
      const end_date_export = dayjs(end_date).format('YYYY_MM_DD')
      exportCSV(data, start_date_export, end_date_export)
      //downloadCSV(data, start_date, end_date)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Export point csv has error : ${message} `,
      })
    }

    setTimeout(() => {
      setVisible(false)
      setConfirmLoading(false)
    }, 2000)
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'Date',
      align: 'center',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD')}</span>
      },
    },
    {
      title: 'Wallet ID',
      dataIndex: 'WalletID',
      align: 'center',
    },
    {
      title: 'Transaction Name',
      dataIndex: 'TransactionName',
      align: 'center',
    },
    {
      title: 'Point',
      dataIndex: 'Point',
      align: 'center',
    },
  ]

  const exportCSV = (data, start_date, end_date) => {
    const opts = {
      // fields: ['WalletID', 'Adjustamount', 'Note'],
      fields: ['walletId', 'adjustamount', 'note'],
    }
    const parser = new Parser(opts)
    const csv = parser.parse(data)
    //console.log('data csv : ', csv)
    const newcsv = csv.replace(/["']/g, '') // new
    const url = window.URL.createObjectURL(new Blob(['\uFEFF', newcsv])) // new
    //const url = window.URL.createObjectURL(new Blob(['\uFEFF', csv]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ADJUST_POINT_IN_${start_date}.csv`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  const Download = async () => {
    start_date = date[0]
    end_date = date[1]

    if (start_date === null || end_date === null) {
      swal({
        title: 'Error',
        text: 'Please choose period date',
        icon: 'error',
        button: 'close',
      })
      return false
    }

    try {
      const axios = getAxios({ access_token })
      const respDownPointCsv = await axios.get(
        `/api/v1/reports/point/downPointCSV?start_date=${start_date}&end_date=${end_date}`,
      )
      let { data } = respDownPointCsv.data
      data = data.map((d, i) => {
        return {
          A: 'xxx',
          key: `${i}`,
          ...d,
          Date: dayjs(d.Date).format('YYYY-MM-DD'),
        }
      })
      downloadCSV(data, start_date, end_date)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Down point csv has error : ${message} `,
      })
    }
  }

  const downloadCSV = (data, start_date, end_date) => {
    const opts = {
      fields: ['Date', 'WalletID', 'TransactionName', 'Point'],
    }
    const parser = new Parser(opts)
    const csv = parser.parse(data)
    const url = window.URL.createObjectURL(new Blob(['\uFEFF', csv]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `ADJUST_POINT_IN_${start_date}_${end_date}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  useEffect(() => {
    searchData()
  }, [])

  return (
    <div>
      <Modal
        title="Insert note"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Input onChange={(e) => ChangeNote(e.target.value)} />
      </Modal>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Point Transaction
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
                      &nbsp;
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: 'orange',
                          border: 'darkorange',
                        }}
                        onClick={showModalExport}
                      >
                        Export
                      </Button>
                      &nbsp;
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: '#28a745',
                          borderColor: '#28a745',
                        }}
                        onClick={() => {
                          Download()
                        }}
                      >
                        Download
                      </Button>
                    </Form>
                    <br />
                    <div className="row">
                      <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ y: '57vh' }}
                      />
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
export default Pointhistory
