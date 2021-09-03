import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'ant-table-extensions'
import {
  DatePicker,
  Select,
  Input,
  Tag,
  Drawer,
  Button,
  Card,
  Descriptions,
  notification,
  Form,
  Tooltip,
} from 'antd'
import {
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import queryString from 'query-string'
import 'antd/dist/antd.css'
import * as dayjs from 'dayjs'
import { channels } from '../../Config'
import { getAxios, getErrorMessage } from '../../Services'
import { UserContext } from '../../userContext'
import { Parser } from 'json2csv'

const { RangePicker } = DatePicker

const { Option } = Select

const endPointAPI = process.env.REACT_APP_API || ''

const Billpaytransaction = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  let start_date = ''
  let end_date = ''

  const [transactionDetail, setTransactionDetail] = useState({})
  const [visible, setVisible] = useState(false)

  const [date, setDate] = useState([null, null])
  const [statusTrasaction, setStatus] = useState('PAID')
  const [channel, setChannel] = useState(null)
  const [refID, setRefID] = useState('')
  const [data, setData] = useState([])

  const [page, setPage] = useState({ current: 1, pageSize: 20 })
  const [total, setTotal] = useState(0)
  const [exports, setExports] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleChangeDate = (date, dateString) => {
    setDate(dateString)
  }
  const handleChangeStatus = (value) => {
    setStatus(value)
  }
  const handleChangeChannel = (value) => {
    setChannel(value)
  }

  const downloadCSV = (data, stDate, edDate) => {
    setLoading(true)
    const opts = {
      fields: [
        'id',
        'reference_id',
        'channel_id',
        'customer_id',
        'customer_name',
        'receipt_no',
        'total_pay',
        'trans_fee',
        'transaction_id',
        'updated_at',
        'status',
        'completed',
      ],
    }
    const parser = new Parser(opts)
    const csv = parser.parse(data)

    const url = window.URL.createObjectURL(new Blob(['\uFEFF', csv]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      //`export-billpay-${dayjs().format('YYYYMMDD')}.csv`,
      `export-billpay-${stDate}-${edDate}.csv`,
    )
    // 3. Append to html page
    document.body.appendChild(link)
    // 4. Force download
    link.click()
    setLoading(false)
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  const exportData = async () => {
    let dataArr = []
    let dataArrMap
    const fixLimit = 100
    const { total } = exports
    const x = total % fixLimit
    var n = total / fixLimit

    const stDate = dayjs(date[0]).format('YYYYMMDD')
    const edDate = dayjs(date[1]).format('YYYYMMDD')

    if (x > 0) n = n + 1

    try {
      for (var i = 1; i <= n; i++) {
        const query = { ...exports, page: i, limit: fixLimit }
        const stringified = queryString.stringify(query, { skipNull: true })
        const axios = getAxios({ access_token })
        const respBillpayExport = await axios.get(
          `${endPointAPI}/api/v1/billpay/transaction?${stringified}`,
        )
        let { data } = respBillpayExport.data
        dataArr = dataArr.concat(data)
        dataArrMap = dataArr.map((x) => {
          const { updated_at } = x
          return {
            ...x,
            updated_at: dayjs(updated_at).format('YYYY-MM-DD HH:mm:ss'),
          }
        })
      }
      downloadCSV(dataArrMap, stDate, edDate)
    } catch (err) {
      console.log('error')
    }
  }

  const searchData = async ({ page, pageSize }) => {
    try {
      start_date = date[0]
      end_date = date[1]

      const parames = {
        start_date,
        end_date,
        status: statusTrasaction,
        channel_id: channel,
        reference_id: refID,
        limit: pageSize,
        page: page,
      }

      const stringified = queryString.stringify(parames, { skipNull: true })
      setLoading(true)
      const axios = getAxios({ access_token })
      const respBillpay = await axios.get(
        `${endPointAPI}/api/v1/billpay/transaction?${stringified}`,
      )
      setLoading(false)

      let { data, total } = respBillpay.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setExports({ total, ...parames })
      setData(data)
      setTotal(total)
      setPage({ current: page, pageSize: pageSize })
    } catch (err) {
      setLoading(false)
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data bill pay transaction error : ${message}`,
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: 'Reference ID',
      dataIndex: 'reference_id',
      key: 'reference_id',
      width: 150,
    },
    {
      title: 'Channel',
      dataIndex: 'channel_id',
      key: 'channel_id',
      ellipsis: true,
      render: (value) => {
        return (
          <span>
            {/* {value === 1 ? 'PEA การไฟฟ้าส่วนภูมิภาค' : 'MEA การไฟฟ้านครหลวง'} */}

            {value === 1
              ? 'PEA การไฟฟ้าส่วนภูมิภาค'
              : value === 2
              ? 'MEA การไฟฟ้านครหลวง'
              : value === 3
              ? 'AIS'
              : value === 4
              ? 'TrueMove H'
              : 'DTAC'}
          </span>
        )
      },
    },
    {
      title: 'Customer ID',
      dataIndex: 'customer_id',
      key: 'customer_id',
      width: 150,
    },

    {
      title: 'Receipt No',
      dataIndex: 'receipt_no',
      key: 'receipt_no',
      ellipsis: true,
    },
    {
      title: 'TotalPay',
      dataIndex: 'total_pay',
      key: 'total_pay',
      align: 'right',
      render: (value) => {
        return (
          <span>
            {value.toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
        )
      },
    },
    // {
    //   title: 'Fee',
    //   dataIndex: 'trans_fee',
    //   key: 'trans_fee',
    //   render: (value) => {
    //     return (
    //       <span>
    //         {value.toLocaleString('en', { minimumFractionDigits: 2 })}
    //       </span>
    //     )
    //   },
    // },
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
    },

    {
      title: 'Updated at',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD HH:mm')}</span>
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        return (
          <span>
            {value === 'NEW' ? (
              <Tag color="orange-inverse">{value}</Tag>
            ) : value === 'PAID' ? (
              <Tag color="green-inverse">{value}</Tag>
            ) : (
              <Tag color="volcano-inverse">{value}</Tag>
            )}
          </span>
        )
      },
    },
    {
      title: 'Complete',
      dataIndex: 'completed',
      key: 'completed',
      render: (value) => {
        return (
          <span>
            {value === true ? (
              <Tag color="green-inverse">True</Tag>
            ) : (
              <Tag color="orange-inverse">False</Tag>
            )}
          </span>
        )
      },
    },
    {
      title: 'Action',
      key: 'x',
      render: (value, row, index) => {
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setTransactionDetail(value)
              setVisible(true)
            }}
          ></Button>
        )
      },
    },
  ]

  useEffect(() => {
    return () => {}
  }, [])

  const {
    id,
    local_office_id,
    paid_at,
    receipt_no,
    reference_id,
    service,
    status,
    total_interest_amount,
    total_item,
    total_pay,
    total_vat,
    trans_fee,
    transaction_id,
    updated_at,
    detail,
  } = transactionDetail

  return (
    <div>
      <Drawer
        width={'30%'}
        title="Detail"
        placement="right"
        closable={true}
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        {transactionDetail && (
          <Descriptions title="" column={1}>
            <Descriptions.Item label="ID">{id}</Descriptions.Item>
            <Descriptions.Item label="OfficeID">
              {local_office_id}
            </Descriptions.Item>
            <Descriptions.Item label="Paid at">
              {dayjs(paid_at).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Receipt no">
              {receipt_no}
            </Descriptions.Item>
            <Descriptions.Item label="ReferenceID">
              {reference_id}
            </Descriptions.Item>
            <Descriptions.Item label="Service">{service}</Descriptions.Item>
            <Descriptions.Item label="Status">{status}</Descriptions.Item>
            <Descriptions.Item label="Total interest amount">
              {total_interest_amount}
            </Descriptions.Item>
            <Descriptions.Item label="Total item">
              {total_item}
            </Descriptions.Item>
            <Descriptions.Item label="Total pay">{total_pay}</Descriptions.Item>
            <Descriptions.Item label="Vat">{total_vat}</Descriptions.Item>
            <Descriptions.Item label="Fee">{trans_fee}</Descriptions.Item>
            <Descriptions.Item label="RransactionID">
              {transaction_id}
            </Descriptions.Item>
            <Descriptions.Item label="Updated at">
              {dayjs(updated_at).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        )}
        {detail &&
          Array.isArray(detail) &&
          detail.map((d, i) => {
            const {
              no,
              reference_id: rfId,
              debt_type,
              due_date,
              unit_used,
              vatcode,
              total_pay,
              total_amount,
              total_vat,
              total_interest_amount,
              total_interest_day,
              mainsub,
              bill_period,
              ca_doc,
            } = d
            return (
              <Card key={`card-${i + 1}`} title={`No. : ${no}`}>
                <Descriptions title="" column={1}>
                  <Descriptions.Item label="No">{no}</Descriptions.Item>
                  <Descriptions.Item label="RefID">{rfId}</Descriptions.Item>
                  <Descriptions.Item label="Debt type">
                    {debt_type}
                  </Descriptions.Item>
                  <Descriptions.Item label="Due date">
                    {dayjs(due_date).format('YYYY-MM-DD HH:mm:ss')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Unit used">
                    {unit_used}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vat code">
                    {vatcode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total pay">
                    {total_pay.toLocaleString('en', {
                      minimumFractionDigits: 2,
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total amount">
                    {total_amount.toLocaleString('en', {
                      minimumFractionDigits: 2,
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total vat">
                    {total_vat.toLocaleString('en', {
                      minimumFractionDigits: 2,
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total interest amount">
                    {total_interest_amount}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total interest day">
                    {total_interest_day}
                  </Descriptions.Item>
                  <Descriptions.Item label="Main sub">
                    {mainsub}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bill period">
                    {bill_period}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ca doc">{ca_doc}</Descriptions.Item>
                </Descriptions>
              </Card>
            )
          })}
      </Drawer>

      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Bill Payment Transaction
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
                      name="customized_form_controls"
                      layout="inline"
                      // onFinish={onFinish}
                      initialValues={{
                        price: {
                          number: 0,
                          currency: 'rmb',
                        },
                      }}
                    >
                      <Form.Item>
                        <RangePicker
                          id="txtDate"
                          onChange={handleChangeDate}
                          showTime
                        />
                      </Form.Item>
                      <Form.Item label="Status">
                        <Select
                          defaultValue="PAID"
                          onChange={handleChangeStatus}
                        >
                          <Option value="PAID">PAID</Option>
                          <Option value="CANCELLED">CANCELLED</Option>
                          <Option value="NEW">NEW</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label="Channel">
                        <Select
                          onChange={handleChangeChannel}
                          style={{ minWidth: '100px' }}
                        >
                          {channels &&
                            channels.map((c) => {
                              return (
                                <Option
                                  title={c.name}
                                  key={c.name}
                                  value={c.id}
                                >
                                  {c.name}
                                </Option>
                              )
                            })}
                        </Select>
                      </Form.Item>

                      <Form.Item label="Referance ID">
                        <Input
                          placeholder="Reference ID"
                          onChange={(event) => setRefID(event.target.value)}
                        />
                      </Form.Item>

                      <Button
                        type="primary"
                        shape="circle"
                        icon={<SearchOutlined />}
                        className="btn btn-success"
                        loading={loading}
                        onClick={() => {
                          searchData({ page: 1, pageSize: 20 })
                        }}
                      />

                      <Tooltip title="export">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            exportData(total, data, date[0], date[1])
                          }}
                          disabled={!exports ? true : false}
                          style={{ marginLeft: '10px' }}
                        />
                      </Tooltip>
                    </Form>

                    <div className="row">
                      <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ y: '57vh' }}
                        pagination={{
                          total: total,
                          current: page.current,
                          pageSize: page.pageSize,
                          onChange: (page, pageSize) => {
                            searchData({ page, pageSize })
                          },
                        }}
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
export default Billpaytransaction
