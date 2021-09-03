import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  notification,
  Spin,
  Tooltip,
} from 'antd'
import * as dayjs from 'dayjs'
import {
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { useHistory } from 'react-router-dom'
import { Parser } from 'json2csv'
import queryString from 'query-string'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'

const today = dayjs().format('YYYY-MM-DD')

const Ranking = () => {
  let pagesize = 20
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  let history = useHistory()

  const [walletID, setWalletID] = useState('')
  const [name, setName] = useState('')
  const [taxID, setTaxID] = useState('')

  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [loading, setLoading] = useState(true)

  let lenData = data.length

  const [page, setPage] = useState({ current: 1, pageSize: 20 })
  const [total, setTotal] = useState(0)

  const ViewHistory = (walletID) => {
    history.push({
      pathname: '/Amlo/Rankinghistory',
      search: '?walletID=' + walletID,
    })
  }

  const searchData = async ({ page, pageSize }) => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respRank = await axios.get(
      `/api/v1/reports/amlo/rankListSearch?walletID=${walletID}&name=${name}&taxID=${taxID}&page=${page}&limit=${pagesize}`,
    )
    let { data } = respRank.data
    let total = respRank.data.count
    data = data.map((d, i) => {
      return {
        ...d,
      }
    })
    setData(data)
    setTotal(total)
    setPage({ current: page, pageSize: pagesize })
    setLoading(false)
  }

  const fetchDataRankList = useCallback(async (page, pagesize) => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/amlo/rankList?page=${page}&limit=${pagesize}`,
      )
      let { data } = responseData.data
      let total = responseData.data.count
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setData(data)
      setLoading(false)
      setTotal(total)
      setPage({ current: page, pageSize: pagesize })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data rank error : ${message}`,
      })
      setLoading(false)
    }
  }, [])

  const exportData = async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const respRanking = await axios.get(
        `/api/v1/reports/amlo/downloadRanking`,
      )
      const { data: respranking } = respRanking
      const { data } = respranking
      setData2(data)
      document.querySelector('#button-download-as-xls').click()
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Download ranking has error : ${message} `,
      })
    }
    setLoading(false)
    // try {
    //   const axios = getAxios({ access_token })
    //   const respDownRankingCsv = await axios.get(
    //     `/api/v1/reports/amlo/downRankingCSV`,
    //   )
    //   let { data } = respDownRankingCsv.data
    //   data = data.map((d, i) => {
    //     return {
    //       key: `${i}`,
    //       ...d,
    //       ชื่อนามสกุล: d.Name,
    //       เลขประจำตัวประชาชน: d.TaxID,
    //       ระดับความเสี่่ยง: d.Rank,
    //       อาชีพ: d.OccupationName,
    //       จังหวัด: d.ProvinceNameTH,
    //       เขตอำเภอ: d.DistrictNameTH,
    //       วันที่คำนวณความเสี่ยง: dayjs(d.LastDateCalRank).format('YYYY-MM-DD'),
    //     }
    //   })
    //   downRankingCsv(data)
    // } catch (err) {
    //   const { status, message } = getErrorMessage(err)
    //   notification.warning({
    //     message: `(${status}) Export ranking csv has error : ${message} `,
    //   })
    // }
  }

  // const downRankingCsv = (data) => {
  //   const opts = {
  //     fields: [
  //       'WalletID',
  //       'ชื่อนามสกุล',
  //       'เลขประจำตัวประชาชน',
  //       'ระดับความเสี่่ยง',
  //       'อาชีพ',
  //       'จังหวัด',
  //       'เขตอำเภอ',
  //       'วันที่คำนวณความเสี่ยง',
  //     ],
  //   }
  //   const parser = new Parser(opts)
  //   const csv = parser.parse(data)
  //   const url = window.URL.createObjectURL(new Blob(['\uFEFF', csv]))
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', `ranking.csv`)
  //   document.body.appendChild(link)
  //   link.click()
  //   link.parentNode.removeChild(link)
  // }

  let i = 0
  const renderTable = () => {
    return data2.map((respranking) => {
      let Rank =
        respranking.TransactionFactorRank > respranking.CurrentRank
          ? respranking.TransactionFactorRank
          : respranking.CurrentRank
      i++
      return (
        <tr>
          <td></td>
          <td>{i}</td>
          <td align="center" style={{ fontSize: '11px' }}>
            {respranking.WalletID.substring(0, 3)}-
            {respranking.WalletID.substring(5, 3)}-
            {respranking.WalletID.substring(6, 5)}-
            {respranking.WalletID.substring(6, 14)}-
            {respranking.WalletID.substring(15, 14)}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {respranking.Name}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {/* {respranking.TaxID.substring(0, 3)}-
            {respranking.TaxID.substring(5, 3)}-
            {respranking.TaxID.substring(6, 5)}-
            {respranking.TaxID.substring(6, 14)} */}
            {respranking.TaxID.substring(0, 1)}-
            {respranking.TaxID.substring(1, 5)}-
            {respranking.TaxID.substring(5, 10)}-
            {respranking.TaxID.substring(10, 12)}-
            {respranking.TaxID.substring(13, 12)}
          </td>
          <td align="center" style={{ fontSize: '11px' }}>
            {Rank}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {respranking.LastDateCalRank}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {respranking.NextDateCalRank}
          </td>
        </tr>
      )
    })
  }

  useEffect(() => {
    fetchDataRankList(1, 20)
  }, [])

  const columns = [
    // {
    //   title: 'ID',
    //   key: 'id',
    //   dataIndex: 'id',
    //   width: '60px',
    // },
    {
      title: 'เลขที่ Wallet',
      dataIndex: 'WalletID',
      align: 'left',
    },
    {
      title: 'ชื่อ นามสกุล',
      dataIndex: 'Name',
      align: 'left',
    },
    {
      title: 'เลขประจำตัวประชาชน',
      dataIndex: 'TaxID',
      align: 'left',
      width: '20%',
    },
    {
      title: 'คะแนนความเสี่ยง',
      align: 'right',
      width: '15%',
      render: (record) => {
        return (
          <span>
            {record.TransactionFactorRank > record.CurrentRank
              ? record.TransactionFactorRank
              : record.CurrentRank}
          </span>
        )
      },
    },
    {
      title: 'วันที่ประเมิน',
      dataIndex: 'LastDateCalRank',
      align: 'left',
      render: (values) => {
        if (values === '-') {
          return <span>-</span>
        } else {
          return <span>{dayjs(values).format('YYYY-MM-DD')}</span>
        }
      },
    },
    {
      title: 'วันที่ประเมินครั้งต่อไป',
      dataIndex: 'NextDateCalRank',
      align: 'left',
      render: (values) => {
        if (values === '-') {
          return <span>-</span>
        } else {
          return <span>{dayjs(values).format('YYYY-MM-DD')}</span>
        }
      },
    },
    {
      title: 'ดูประวัติ',
      dataIndex: 'WalletID',
      align: 'center',
      render: (values) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(e) => {
            ViewHistory(values, e)
          }}
        ></Button>
      ),
    },
  ]

  lenData = data.length

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          {/* <div className="card">
            <div className="card-body">
              <div className="form-group"> */}
          <Form
            name="frm_ranking"
            layout="inline"
            style={{ textAlign: 'left' }}
          >
            <Form.Item label="WalletID">
              <Input
                name="walletID"
                value={walletID}
                onChange={(event) => setWalletID(event.target.value)}
                maxLength="15"
              />
            </Form.Item>
            <Form.Item label="ชื่อ นามสกุล">
              <Input
                name="name"
                placeholder="ชื่อ นามสกุล"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Item>
            <Form.Item label="เลขประจำตัวประชาชน">
              <Input
                name="taxID"
                value={taxID}
                onChange={(event) => setTaxID(event.target.value)}
                maxLength="13"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                onClick={() => {
                  //searchData()
                  searchData({ page: 1, pageSize: 20 })
                }}
              >
                {/* Search */}
              </Button>
              &nbsp;
              <Tooltip title="export">
                <Button
                  type="default"
                  shape="circle"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    exportData()
                  }}
                >
                  {/* Export */}
                </Button>
              </Tooltip>
            </Form.Item>
          </Form>
          <br />
          <div className="row">
            {
              <Spin spinning={loading} tip="Loading">
                <Table
                  columns={columns}
                  dataSource={data}
                  scroll={{ y: '57vh' }}
                  pagination={{
                    total: total,
                    current: page.current,
                    pageSize: page.pageSize,
                    disabled: lenData < 20 ? true : false,
                    onChange: (page, pageSize) => {
                      searchData({ page, pageSize })
                    },
                  }}
                />
              </Spin>
            }
          </div>
          {/* </div>
            </div>
          </div> */}
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

                  <th colSpan="3">Thai Micro Digital Solutions Co., Ltd.</th>
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
                    รายงานข้อมูลในระบบ ณ วันที่{' '}
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
                      No.
                    </th>
                    <th
                      className="text-center bgblue text-white"
                      style={{ fontWeight: 'normal', width: '200px' }}
                    >
                      WalletID.
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
                      style={{ fontWeight: 'normal', width: '150px' }}
                    >
                      ระดับความเสี่่ยง
                    </th>
                    <th
                      className="text-center bgblue text-white"
                      style={{ fontWeight: 'normal', width: '200px' }}
                    >
                      วันที่คำนวณความเสี่ยง
                    </th>
                    <th
                      className="text-center bgblue text-white"
                      style={{ fontWeight: 'normal', width: '200px' }}
                    >
                      วันที่คำนวณครั้งต่อไป
                    </th>
                    {/* <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Current grade
                            </th> */}
                    {/* <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Next review date
                            </th> */}
                  </tr>
                </thead>
                <tbody>
                  {renderTable()}
                  {/* <tr>
                            <td></td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td align="right" style={{ fontSize: '11px' }}>
                              Customer grade
                            </td>
                            <td style={{ fontSize: '11px' }}>3</td>
                            <td style={{ fontSize: '11px' }}>{Rank3}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{ fontSize: '11px' }}>2</td>
                            <td style={{ fontSize: '11px' }}>{Rank2}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{ fontSize: '11px' }}>1</td>
                            <td style={{ fontSize: '11px' }}>{Rank1}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td align="right" style={{ fontSize: '11px' }}>
                              Total
                            </td>
                            <td style={{ fontSize: '11px' }}>
                              {Rank3 + Rank2 + Rank1}
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                          </tr>
                          {type === 'New' && (
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td align="right" style={{ fontSize: '11px' }}>
                                New Customer
                              </td>
                              <td style={{ fontSize: '11px' }}>{i}</td>
                            </tr>
                          )} */}
                </tbody>
              </table>
              <ReactHTMLTableToExcel
                className="btn btn-success"
                table="table-to-xls"
                filename="ReportRanking"
                sheet="sheet 1"
                buttonText="Export"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Ranking
