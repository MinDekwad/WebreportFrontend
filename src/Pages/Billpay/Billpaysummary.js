import React, { useState, useContext } from 'react'
import { Table } from 'ant-table-extensions'
import { DatePicker, Select, notification, Button, Form } from 'antd'
import { getAxios, getErrorMessage } from '../../Services'
import queryString from 'query-string'
import { UserContext } from '../../userContext'
import { SearchOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

const { Option } = Select

const endPointAPI = process.env.REACT_APP_API || ''

function Billpaysummary() {
  let start_date = ''
  let end_date = ''

  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [date, setDate] = useState([null, null])
  const [type, setType] = useState('TOTAL_PAY')
  const [data, setData] = useState([])
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChangeDate = (date, dateString) => {
    setDate(dateString)
  }
  const handleChangeType = (value) => {
    setType(value)
  }

  const searchData = async () => {
    try {
      start_date = date[0]
      end_date = date[1]

      const stringified = queryString.stringify(
        {
          start_date,
          end_date,
          field: type,
        },
        { skipNull: true },
      )

      const axios = getAxios({ access_token })
      setLoading(true)
      const resp = await axios.get(
        `${endPointAPI}/api/v1/billpay/summary?${stringified}`,
      )

      setLoading(false)
      let { data: dataSum } = resp.data
      //console.log('dataSum : ', dataSum)

      const params = queryString.stringify(
        {
          start_date,
          end_date,
          field: 'TRANS_FEE',
        },
        { skipNull: true },
      )
      const respFee = await axios.get(
        `${endPointAPI}/api/v1/billpay/summary?${params}`,
      )

      const {
        data: { data: feeData },
      } = respFee || { data: {} }
      //console.log('data : ', data)

      if (dataSum !== null) {
        let mapFee = feeData.reduce((m, obj) => {
          const { client_id, service, status, channel_transactions } = obj
          const key = `${client_id}:${service}:${status}:${channel_transactions}`
          m[key] = obj
          return m
        }, {})

        let finalData = dataSum.map((obj) => {
          const { client_id, service, status, channel_transactions } = obj
          const key = `${client_id}:${service}:${status}:${channel_transactions}`

          const { sum: sumFee } = mapFee[key]
          return { ...obj, sumFee }
        })
        setSummaries(finalData)
      } else {
        setSummaries([])
      }
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data bill pay summary error : ${message}`,
      })
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Client ID',
      dataIndex: 'client_id',
    },
    {
      title: 'Service',
      dataIndex: 'service',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Channel',
      dataIndex: 'channel_transactions',
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
      title: 'Sum',
      dataIndex: 'sum',
      render: (value) => {
        return (
          <span>
            {value.toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
        )
      },
    },
    {
      title: 'Fee',
      dataIndex: 'sumFee',
      render: (value) => {
        return (
          <span>
            {value.toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
        )
      },
    },
  ]

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Bill Payment Summary
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
                    <Form name="customized_form_controls" layout="inline">
                      <Form.Item>
                        <RangePicker id="txtDate" onChange={handleChangeDate} />
                      </Form.Item>
                      <Form.Item>
                        {/* <Button
                        className="btn btn-success"
                        type="button"
                        onClick={() => {
                          searchData()
                        }}
                      >
                        <i className="fa fa-search"></i> Search
                      </Button> */}
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<SearchOutlined />}
                          className="btn btn-success"
                          loading={loading}
                          onClick={() => {
                            searchData()
                          }}
                        />
                      </Form.Item>
                    </Form>
                    <br />
                    <div className="row">
                      <div style={{ width: '100%' }}>
                        {summaries && (
                          <Table columns={columns} dataSource={summaries} />
                        )}
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
export default Billpaysummary
