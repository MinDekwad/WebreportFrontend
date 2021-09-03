import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  notification,
  Spin,
  Popconfirm,
} from 'antd'
import * as dayjs from 'dayjs'
import { EyeOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { useHistory } from 'react-router-dom'
import { Parser } from 'json2csv'
import swal from 'sweetalert'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import moment from 'moment'

const today = dayjs().format('YYYY-MM-DD')

const Watchlist = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  let history = useHistory()

  const [name, setName] = useState('')
  const [taxID, setTaxID] = useState('')

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [data3, setData3] = useState([])

  const searchData = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respRank = await axios.get(
      `/api/v1/reports/amlo/watchlistSearch?name=${name}&taxID=${taxID}`,
    )
    let { data } = respRank.data
    console.log(data)
    data = data.map((d, i) => {
      const { edges } = d || { edges: {} }
      const { related } = edges || { related: {} }
      return {
        ...d,
        ...related,
        key: d.id,
      }
    })
    setData(data)
    setLoading(false)
  }
  const fetchDataWatchList = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(`/api/v1/reports/amlo/watchlist`)
      let { data } = responseData.data
      data = data.map((d, i) => {
        const { edges } = d || { edges: {} }
        const { related } = edges || { related: {} }
        return {
          ...related,
          ...d,
          key: d.id,
        }
      })
      setData(data)
      setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data watchlist error : ${message}`,
      })
      setLoading(false)
    }
  }, [])

  // delete
  const [visibleDel, setVisibleDel] = React.useState(false)
  const [confirmLoadingDel, setConfirmLoadingDel] = React.useState(false)
  const showPopDel = () => {
    setVisibleDel(true)
  }
  const handleOkDel = async (id) => {
    setConfirmLoadingDel(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/delWatchlist?id=${id}`,
      )

      const data = responseData.data
      const message = data.message

      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoadingDel(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          fetchDataWatchList()
        }, 2000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Delete watchlist has error : ${message} `,
      })
    }
    setConfirmLoadingDel(false)
  }
  const handleCancelDel = () => {
    setVisibleDel(false)
  }

  const CalculateRankWatchlist = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })

    const respCalculateRankByWatchlist = await axios({
      method: 'post',
      //url: `/api/v1/reports/amlo/calculateRankingByWatchlist`,
      url: `/api/v1/reports/amlo/calculate/wl`,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300 * 1000,
    })
    const data = respCalculateRankByWatchlist.data
    const message = data.message
    const data2 = data.data
    const id = data2.id
    if (message === 'success') {
      intervalCheckProgressCalcuWl(id)
      return
    }
    swal({
      title: 'Error',
      text: 'Cannot save data',
      icon: 'error',
      timer: 2000,
      button: false,
    })
  }

  const intervalCheckProgressCalcuWl = async (id) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseWlStatus = await axios.get(
            `/api/v1/reports/amlo/status/wl?request_id=${id}`,
          )
          const { data: WlStatus } = responseWlStatus
          const { data } = WlStatus
          let status = data.fileinsert_status
          if (status === true) {
            clearInterval(timechkData)
            setLoading(false)
            swal({
              title: 'Done!',
              text: 'Save Success',
              icon: 'success',
              button: 'close',
            }).then(() => {
              history.push({
                pathname: '/Amlo/Ranking',
              })
            })
          }
        } catch (err) {
          const { status, message } = getErrorMessage(err)
          notification.warning({
            message: `(${status}) Get status watchlist error : ${message}`,
          })
        }
      },
      5000,
      [],
    )
  }

  const DownloadListWatchlist = async () => {
    setLoading(true)
    let day = today
    try {
      const axios = getAxios({ access_token })
      const respWl = await axios.get(`/api/v1/reports/amlo/watchlist`)
      //let { data } = respArea.data
      const { data: respwl } = respWl
      const { data } = respwl

      setData3(data)
      document.querySelector('#button-download-as-xls').click()
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Dowload Watchlist list error : ${message}`,
      })
    }
    setLoading(false)
  }

  // const DownloadListWatchlist = async () => {
  //   let day = today
  //   try {
  //     const axios = getAxios({ access_token })
  //     const responseData = await axios.get(`/api/v1/reports/amlo/watchlist`)
  //     let { data } = responseData.data
  //     data = data.map((d, i) => {
  //       const { edges } = d || { edges: {} }
  //       const { related } = edges || { related: {} }
  //       return {
  //         ...related,
  //         key: `${i}`,
  //         ...d,
  //       }
  //     })
  //     setLoading(false)
  //     downloadCSV(data, day)
  //   } catch (err) {
  //     const { status, message } = getErrorMessage(err)
  //     notification.warning({
  //       message: `(${status}) Download watchlist csv has error : ${message}`,
  //     })
  //     setLoading(false)
  //   }
  // }

  // const downloadCSV = (data, day) => {
  //   const opts = {
  //     fields: ['Name', 'TaxID', 'TypeName'],
  //   }
  //   const parser = new Parser(opts)
  //   const csv = parser.parse(data)
  //   const url = window.URL.createObjectURL(new Blob(['\uFEFF', csv]))
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', `WATCHLIST_${day}.csv`)
  //   document.body.appendChild(link)
  //   link.click()
  //   link.parentNode.removeChild(link)
  // }

  let i = 0
  const renderTable = () => {
    return data3.map((respwl) => {
      i++
      return (
        <tr>
          <td></td>
          <td>{i}</td>
          <td align="left" style={{ fontSize: '11px' }}>
            {respwl.Name}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {/* {respwl.TaxID.substring(0, 1)}-{respwl.TaxID.substring(1, 5)}-
            {respwl.TaxID.substring(5, 10)}-{respwl.TaxID.substring(10, 12)}-
            {respwl.TaxID.substring(13, 12)} */}
            {respwl.TaxID !== undefined
              ? respwl.TaxID.substring(0, 1) +
                '-' +
                respwl.TaxID.substring(1, 5) +
                '-' +
                respwl.TaxID.substring(5, 10) +
                '-' +
                respwl.TaxID.substring(10, 12) +
                '-' +
                respwl.TaxID.substring(13, 12)
              : ''}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {respwl.edges.related.TypeName}
          </td>
          <td align="center" style={{ fontSize: '11px' }}>
            {respwl.ImportDate !== undefined
              ? respwl.ImportDate.substring(0, 10)
              : ''}
          </td>
          <td align="center" style={{ fontSize: '11px' }}>
            {respwl.UserUpload}
          </td>
        </tr>
      )
    })
  }

  useEffect(() => {
    fetchDataWatchList()
  }, [])

  const columns = [
    {
      title: 'ชื่อ นามสกุล',
      dataIndex: 'Name',
      align: 'left',
    },
    {
      title: 'เลขประจำตัวประชาชน',
      dataIndex: 'TaxID',
      align: 'left',
    },
    {
      title: 'ประเภท',
      dataIndex: 'TypeName',
      align: 'left',
    },
    {
      title: '#',
      key: 'key',
      align: 'center',
      width: '10%',
      render: (value, record) => (
        <Popconfirm
          title="Are you sure to delete"
          visibleDel={visibleDel}
          onConfirm={(e) => {
            handleOkDel(record.key, e)
          }}
          okButtonProps={{ loading: confirmLoadingDel }}
          onCancel={handleCancelDel}
        >
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={showPopDel}
          ></Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <Form
                  name="frm_watchlist"
                  layout="inline"
                  style={{ textAlign: 'left' }}
                >
                  <Form.Item>
                    <label>ชื่อ นามสกุล</label>
                    <Input
                      name="name"
                      placeholder="ชื่อ นามสกุล"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <label>เลขประจำตัวประชาชน</label>
                    <Input
                      name="taxID"
                      //placeholder="XXXXXXXXXXXXX"
                      value={taxID}
                      onChange={(event) => setTaxID(event.target.value)}
                    />
                  </Form.Item>
                  <div style={{ position: 'relative' }}>
                    <Button
                      style={{ position: 'absolute', bottom: '0' }}
                      type="primary"
                      onClick={() => {
                        searchData()
                      }}
                    >
                      Search
                    </Button>
                    &nbsp;
                    <Button
                      //disabled={!dataWatchlist ? true : false}
                      type="primary"
                      onClick={() => {
                        CalculateRankWatchlist()
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        marginLeft: '80px',
                      }}
                    >
                      Calculate
                    </Button>
                    &nbsp;
                    <Button
                      value="large"
                      type="primary"
                      onClick={() => {
                        DownloadListWatchlist()
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        marginLeft: '175px',
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </Form>
                <br />
                <div className="row">
                  {
                    <Spin spinning={loading} tip="Loading">
                      <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ y: '57vh' }}
                      />
                    </Spin>
                  }
                </div>
                <br />
                <div
                  className="col-12"
                  id="table-to-xls1"
                  style={{ display: 'none' }}
                >
                  <div className="card-body table-responsive p-0">
                    <table
                      id="table-to-xls"
                      className="table table-head-fixed text-nowrap table-hover"
                    >
                      <tr>
                        <th className="bgblue text-white"></th>
                        <th className="bgblue text-white"></th>
                        <th className="bgblue text-white"></th>
                        {/* <th className="bgblue text-white"></th> */}

                        <th colSpan="3">
                          Thai Micro Digital Solutions Co., Ltd.
                        </th>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                      <tr>
                        <th className="bgblue text-white"></th>
                        <th className="bgblue text-white"></th>
                        <th className="bgblue text-white"></th>
                        {/* <th className="bgblue text-white"></th> */}

                        <th colSpan="3" style={{ fontSize: '12px' }}>
                          รายงานข้อมูลในระบบ Watchlist ณ วันที่{' '}
                          {dayjs(today).format('DD/MM/YYYY')}
                        </th>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                      <thead>
                        <tr>
                          <th className="bgblue text-white"></th>
                          <th
                            className="bgblue text-white"
                            style={{ fontWeight: 'normal', width: '50px' }}
                          >
                            ลำดับ
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            ชื่อและนามสกุล
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            เลขประจำตัวประชาชน
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            Type code
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '150px' }}
                          >
                            Date of import
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            Upload user
                          </th>
                        </tr>
                      </thead>
                      <tbody>{renderTable()}</tbody>
                    </table>
                    <ReactHTMLTableToExcel
                      className="btn btn-success"
                      table="table-to-xls"
                      filename="ReportWatchlist"
                      sheet="sheet 1"
                      buttonText="Export"
                    />
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
export default Watchlist
