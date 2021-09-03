import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Form,
  DatePicker,
  Input,
  Modal,
  Button,
  InputNumber,
  Card,
  Table,
  notification,
  Spin,
  Drawer,
  Descriptions,
  Tag,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import swal from 'sweetalert'
import * as dayjs from 'dayjs'
import moment from 'moment'
import { EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Parser } from 'json2csv'

const today = dayjs().subtract(1, 'days').format('YYYY-MM-DD')

const Pointkyclbgen = () => {
  let pagesize = 20
  const [page, setPage] = useState({ current: 1, pageSize: 20 })
  const [total, setTotal] = useState(0)

  let history = useHistory()

  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(today)
  const [dateGen, setDateGen] = useState(today)
  const [visibleExportKYC, setVisibleExportKYC] = React.useState(false)
  const [confirmLoadingKYC, setConfirmLoadingKYC] = React.useState(false)
  const [noteKYC, setNoteKYC] = useState('')

  const [visibleExportLB, setVisibleExportLB] = React.useState(false)
  const [confirmLoadingLB, setConfirmLoadingLB] = React.useState(false)
  const [noteLB, setNoteLB] = useState('')

  const [walletID, setWalletID] = useState('')

  const ChangeDate = (date, dateString) => {
    setDate(dateString)
  }

  const ChangeDateGen = (date, dateString) => {
    setDateGen(dateString)
  }

  const ChangeNoteKYC = (value) => {
    setNoteKYC(value)
  }

  const ChangeNoteLB = (value) => {
    setNoteLB(value)
  }

  const CalPointKYC = async () => {
    if (date === '') {
      swal({
        title: 'Error',
        text: 'Please select date',
        icon: 'error',
        button: 'close',
      })
      return
    }
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responDataCalPointKYC = await axios({
        method: 'post',
        url: `/api/v1/reports/pointkyclb/calculatePointKYC?date=${date}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 200 * 1000,
      })
      const { data: DataCalPointKYC } = responDataCalPointKYC
      const { data: DataCalPointKYCs } = DataCalPointKYC
      if (DataCalPointKYCs === 'Error') {
        swal({
          title: 'Error',
          text: 'Cannot calculate point',
          icon: 'error',
          button: 'close',
        })
        setLoading(false)
        return
      }
      if (DataCalPointKYCs === 'Duplicate') {
        swal({
          title: 'Error',
          text: 'Data on this day has already, Please choose another day',
          icon: 'error',
          button: 'close',
        })
        setLoading(false)
        return
      }
      // if (DataCalPointKYCs === 'ConsumerNoData') {
      //   swal({
      //     title: 'Error',
      //     text: 'No data on this day in consumer, Please choose another day',
      //     icon: 'error',
      //     button: 'close',
      //   })
      //   return
      // }
      swal({
        title: 'Done!',
        text: 'Calculate point success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        history.push({
          pathname: '/Pointkyclb/Pointkyclbgen',
          search: `?date=${date}`,
        })
      })
      setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Calculate point kyc has error : ${message} `,
      })
    }
    setLoading(false)
  }

  const CalPointLB = async () => {
    if (date === '') {
      swal({
        title: 'Error',
        text: 'Please select date',
        icon: 'error',
        button: 'close',
      })
      return
    }
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responDataCalPointLB = await axios({
        method: 'post',
        url: `/api/v1/reports/pointkyclb/calculatePointLB?date=${date}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 200 * 1000,
      })
      const { data: DataCalPointLB } = responDataCalPointLB
      const { data: DataCalPointLBs } = DataCalPointLB
      if (DataCalPointLBs === 'Error') {
        swal({
          title: 'Error',
          text: 'Cannot calculate point',
          icon: 'error',
          button: 'close',
        })
        setLoading(false)
        return
      }
      if (DataCalPointLBs === 'Duplicate') {
        swal({
          title: 'Error',
          text: 'Data on this day has already, Please choose another day',
          icon: 'error',
          button: 'close',
        })
        setLoading(false)
        return
      }
      // if (DataCalPointKYCs === 'ConsumerNoData') {
      //   swal({
      //     title: 'Error',
      //     text: 'No data on this day in consumer, Please choose another day',
      //     icon: 'error',
      //     button: 'close',
      //   })
      //   return
      // }
      swal({
        title: 'Done!',
        text: 'Calculate point success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        history.push({
          pathname: '/Pointkyclb/Pointkyclbgen',
          search: `?date=${date}`,
        })
      })
      setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Calculate point loanbinding has error : ${message} `,
      })
    }
    setLoading(false)
  }

  const searchData = async () => {
    if (walletID === '' && dateGen === '') {
      // swal({
      //   title: 'Error',
      //   text: 'Please select WalletID or date gen point',
      //   icon: 'error',
      //   button: 'close',
      // })
      // return
      fetchDataPendingKYCList()
      fetchDataPendingLBList()
    }
    setLoading(true)
    const axios = getAxios({ access_token })
    const responsePendingKYCDataSearch = await axios.get(
      `/api/v1/reports/pointkyclb/pointPendingKYCListSearch?walletID=${walletID}&dategen=${dateGen}`,
    )
    let { data } = responsePendingKYCDataSearch.data
    data = data.map((d, i) => {
      return {
        ...d,
      }
    })
    setData(data)
    setLoading(false)
  }

  const searchData2 = async () => {
    if (walletID === '' && dateGen === '') {
      // swal({
      //   title: 'Error',
      //   text: 'Please select WalletID or date gen point',
      //   icon: 'error',
      //   button: 'close',
      // })
      // return
      fetchDataPendingKYCList()
      fetchDataPendingLBList()
    }
    setLoading(true)
    const axios = getAxios({ access_token })
    const responsePendingLBDataSearch = await axios.get(
      `/api/v1/reports/pointkyclb/pointPendingLBListSearch?walletID=${walletID}&dategen=${dateGen}`,
    )
    let { data } = responsePendingLBDataSearch.data
    console.log(responsePendingLBDataSearch)
    data = data.map((d, i) => {
      return {
        ...d,
      }
    })
    setData2(data)
    setLoading(false)
  }

  const fetchDataPendingKYCList = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responsePendingKYCData = await axios.get(
        `/api/v1/reports/pointkyclb/pointPendingKYCList`,
      )
      let { data } = responsePendingKYCData.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setData(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data point kyc error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  const fetchDataPendingLBList = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responsePendingLBData = await axios.get(
        `/api/v1/reports/pointkyclb/fetchDataPendingLBList`,
      )
      let { data } = responsePendingLBData.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setData2(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data point loan binding error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDataPendingKYCList()
    fetchDataPendingLBList()
  }, [])

  const showModalExportKYC = () => {
    if (date === null) {
      swal({
        title: 'Error',
        text: 'Please choose date',
        icon: 'error',
        button: 'close',
      })
      return false
    }
    setVisibleExportKYC(true)
  }
  const handleOkExportKYC = async () => {
    setConfirmLoadingKYC(true)
    try {
      const axios = getAxios({ access_token })
      const responseCreatePointTransacKycCsv = await axios({
        method: 'get',
        //url: `/api/v1/reports/point/createPointCSV?start_date=${start_date}&end_date=${end_date}&note=${note}&user=${userData}`,
        url: `/api/v1/reports/pointkyclb/createPointTransacKYCCSV?date=${date}&note=${noteKYC}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 200 * 1000,
      })

      const { data: CreatePointTransacKycCsv } =
        responseCreatePointTransacKycCsv.data
      if (CreatePointTransacKycCsv === 'Error') {
        swal({
          title: 'Error',
          text: 'Cannot export csv',
          icon: 'error',
          button: 'close',
        })
        setVisibleExportKYC(false)
        setConfirmLoadingKYC(false)
        return
      }
      if (CreatePointTransacKycCsv === 'NoData') {
        swal({
          title: 'Error',
          text: 'No data on this date',
          icon: 'error',
          button: 'close',
        })
        setVisibleExportKYC(false)
        setConfirmLoadingKYC(false)
        return
      }

      const respExportPointKycCsv = await axios.get(
        `/api/v1/reports/pointkyclb/exportPointKycCsv?date=${date}`,
      )
      let { data } = respExportPointKycCsv.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
          DateExport: dayjs(d.DateExport).format('YYYY-MM-DD'),
          walletId: d.WalletId,
          adjustamount: d.Point,
          note: d.Note,
        }
      })
      const date_export = dayjs(date).format('YYYY_MM_DD')
      exportKYCCSV(data, date_export)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Export point kyc csv has error : ${message} `,
      })
    }

    setTimeout(() => {
      setVisibleExportKYC(false)
      setConfirmLoadingKYC(false)
    }, 2000)
  }
  const handleCancelKYC = () => {
    setVisibleExportKYC(false)
  }
  const exportKYCCSV = (data, date_export) => {
    const opts = {
      //fields: ['WalletId', 'Point', 'Note'],
      fields: ['walletId', 'adjustamount', 'note'],
    }
    const parser = new Parser(opts)
    const csv = parser.parse(data)
    const newcsv = csv.replace(/["']/g, '') // new
    const url = window.URL.createObjectURL(new Blob(['\uFEFF', newcsv])) // new
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ADJUST_POINT_IN_${date_export}_KYC.csv`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  const showModalExportLB = () => {
    if (date === null) {
      swal({
        title: 'Error',
        text: 'Please choose date',
        icon: 'error',
        button: 'close',
      })
      return false
    }
    setVisibleExportLB(true)
  }
  const handleOkExportLB = async () => {
    setConfirmLoadingLB(true)
    try {
      const axios = getAxios({ access_token })
      const responseCreatePointTransacLbCsv = await axios({
        method: 'get',
        //url: `/api/v1/reports/point/createPointCSV?start_date=${start_date}&end_date=${end_date}&note=${note}&user=${userData}`,
        url: `/api/v1/reports/pointkyclb/createPointTransacLBCSV?date=${date}&note=${noteLB}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 200 * 1000,
      })

      const { data: CreatePointTransacLbCsv } =
        responseCreatePointTransacLbCsv.data
      if (CreatePointTransacLbCsv === 'Error') {
        swal({
          title: 'Error',
          text: 'Cannot export csv',
          icon: 'error',
          button: 'close',
        })
        setVisibleExportLB(false)
        setConfirmLoadingLB(false)
        return
      }
      if (CreatePointTransacLbCsv === 'NoData') {
        swal({
          title: 'Error',
          text: 'No data on this date',
          icon: 'error',
          button: 'close',
        })
        setVisibleExportLB(false)
        setConfirmLoadingLB(false)
        return
      }

      const respExportPointLbCsv = await axios.get(
        `/api/v1/reports/pointkyclb/exportPointLbCsv?date=${date}`,
      )
      let { data } = respExportPointLbCsv.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
          // Point: d.PointLB,
          // Note: d.NoteLB,
          DateExport: dayjs(d.DateExport).format('YYYY-MM-DD'),
          walletId: d.WalletID,
          adjustamount: d.PointLB,
          note: d.NoteLB,
        }
      })
      const date_export = dayjs(date).format('YYYY_MM_DD')
      exportLBCSV(data, date_export)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Export point loan binding csv has error : ${message} `,
      })
    }

    setTimeout(() => {
      setVisibleExportLB(false)
      setConfirmLoadingLB(false)
    }, 2000)
  }
  const handleCancelLB = () => {
    setVisibleExportLB(false)
  }
  const exportLBCSV = (data, date_export) => {
    const opts = {
      //fields: ['WalletID', 'Point', 'Note'],
      fields: ['walletId', 'adjustamount', 'note'],
    }
    const parser = new Parser(opts)
    const csv = parser.parse(data)
    const newcsv = csv.replace(/["']/g, '') // new
    const url = window.URL.createObjectURL(new Blob(['\uFEFF', newcsv])) // new
    const link = document.createElement('a')
    link.href = url
    //link.setAttribute('download', `POINT_LB_${date_export}.csv`)
    link.setAttribute('download', `ADJUST_POINT_IN_${date_export}_LB.csv`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  const columns = [
    {
      title: 'WalletID',
      dataIndex: 'WalletID',
      align: 'left',
    },
    {
      title: 'KYCDate',
      dataIndex: 'KYCDate',
      align: 'left',
    },
    {
      title: 'Date Gen',
      dataIndex: 'DateGen',
      align: 'left',
      render: (value) => {
        return (
          <span>
            {value !== undefined ? dayjs(value).format('YYYY-MM-DD') : ''}
          </span>
        )
      },
    },
    {
      title: 'Status Gen',
      dataIndex: 'StatusGen',
      align: 'center',
      key: 'StatusGen',
      render: (value) => {
        return <span>{value === true ? 'Y' : 'N'}</span>
      },
    },
  ]

  const columns2 = [
    {
      title: 'WalletID',
      dataIndex: 'WalletID',
      align: 'left',
    },
    {
      title: 'Loan binding date',
      dataIndex: 'DateTime',
      align: 'left',
      render: (value) => {
        return (
          <span>
            {/* {value !== undefined ? dayjs(value).format('YYYY-MM-DD') : ''} */}
            {value !== undefined ? value.substring(0, 10) : ''}
          </span>
        )
      },
    },
    {
      title: 'Date Gen',
      dataIndex: 'DateGenLB',
      align: 'left',
      render: (value) => {
        return (
          <span>
            {value !== undefined ? dayjs(value).format('YYYY-MM-DD') : ''}
          </span>
        )
      },
    },
    {
      title: 'Status Gen',
      dataIndex: 'StatusGenLB',
      align: 'center',
      key: 'StatusGenLB',
      render: (value) => {
        return <span>{value === true ? 'Y' : 'N'}</span>
      },
    },
  ]

  return (
    <div>
      <Modal
        title="Insert note KYC"
        visible={visibleExportKYC}
        onOk={handleOkExportKYC}
        confirmLoading={confirmLoadingKYC}
        onCancel={handleCancelKYC}
      >
        <Input onChange={(e) => ChangeNoteKYC(e.target.value)} />
      </Modal>
      <Modal
        title="Insert note Loan binding"
        visible={visibleExportLB}
        onOk={handleOkExportLB}
        confirmLoading={confirmLoadingLB}
        onCancel={handleCancelLB}
      >
        <Input onChange={(e) => ChangeNoteLB(e.target.value)} />
      </Modal>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <div className="col-sm-12">
                  <div style={{ borderBottom: '1px solid #000' }}>
                    <h3 style={{ textAlign: 'left' }}>Search</h3>
                    <Form name="frm_search" layout="inline">
                      <Form.Item label="WalletID">
                        <Input
                          name="walletID"
                          value={walletID}
                          onChange={(event) => setWalletID(event.target.value)}
                          maxLength="15"
                        />
                      </Form.Item>
                      <Form.Item label="Date Gen Point">
                        <DatePicker
                          onChange={ChangeDateGen}
                          defaultValue={moment(dateGen)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<SearchOutlined />}
                          onClick={() => {
                            searchData()
                            searchData2()
                          }}
                        ></Button>
                      </Form.Item>
                    </Form>
                  </div>
                  <br />
                  <div>
                    <h3 style={{ textAlign: 'left' }}>Gen point and Export</h3>
                    <Form name="frm_gen_point" layout="inline">
                      <Form.Item label="KYC or loan binding date">
                        <DatePicker
                          onChange={ChangeDate}
                          defaultValue={moment(date)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={CalPointKYC}
                          style={{
                            float: 'left',
                            backgroundColor: '#52c41a',
                            border: '#52c41a',
                          }}
                        >
                          Gen point KYC
                        </Button>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={CalPointLB}
                          style={{
                            float: 'left',
                            backgroundColor: '#52c41a',
                            border: '#52c41a',
                          }}
                        >
                          Gen point Loan binding
                        </Button>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: 'orange',
                            border: 'darkorange',
                          }}
                          onClick={showModalExportKYC}
                        >
                          Export KYC
                        </Button>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: 'orange',
                            border: 'darkorange',
                          }}
                          onClick={showModalExportLB}
                        >
                          Export Loan binding
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                  <br />
                  {
                    <Spin spinning={loading} tip="Loading">
                      <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ y: '57vh' }}
                      />
                    </Spin>
                  }
                  <br />
                  {
                    <Spin spinning={loading} tip="Loading">
                      <Table
                        columns={columns2}
                        dataSource={data2}
                        scroll={{ y: '57vh' }}
                      />
                    </Spin>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Pointkyclbgen
