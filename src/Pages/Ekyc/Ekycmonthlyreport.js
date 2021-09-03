import React, { useState, useContext } from 'react'
//import { Table } from 'antd'
import { Table } from 'ant-table-extensions'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { Spin, Button, notification } from 'antd'
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons'

const Ekycmonthlyreport = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [loading, setloading] = useState(false)
  const [month, setMonth] = useState()
  let monthstr = month + '-' + '01'

  const [data, setData] = useState([])
  const [tmdsKycAll, setTmdsKycAll] = useState(0)
  const [tcrbKycAll, setTcrbKycAll] = useState(0)

  let totalCount = tmdsKycAll + tcrbKycAll
  let tcrbTotalAmount = tcrbKycAll * 20

  const searchData = async (monthstr) => {
    setloading(true)
    try {
      const axios = getAxios({ access_token })
      const responseEKYCmonthly = await axios.get(
        `/api/v1/reports/ekyc/eKycMonthly?date=${monthstr}`,
      )

      let { data } = responseEKYCmonthly.data
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
        message: `(${status}) Get all data ekyc monthly error : ${message}`,
      })
    }
    setloading(false)
  }

  const fetchDataTmdskyc = async (monthstr) => {
    try {
      const axios = getAxios({ access_token })
      const responseTmdskyc = await axios.get(
        `/api/v1/reports/ekyc/eKycMonthlyTmdsAll?date=${monthstr}`,
      )
      const {
        data: { data },
      } = responseTmdskyc
      setTmdsKycAll(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data ekyc monthly TMDS error : ${message}`,
      })
    }
  }

  const fetchDataTcrbkyc = async (monthstr) => {
    try {
      const axios = getAxios({ access_token })
      const responseTcrbkyc = await axios.get(
        `/api/v1/reports/ekyc/eKycMonthlyTcrbAll?date=${monthstr}`,
      )
      const {
        data: { data },
      } = responseTcrbkyc
      setTcrbKycAll(data)
    } catch (error) {
      const { status, message } = getErrorMessage(error)
      notification.warning({
        message: `(${status}) Get all data ekyc monthly TCRB error : ${message}`,
      })
    }
  }

  const columns = [
    {
      title: 'KYC Date',
      dataIndex: 'KYCDate',

      align: 'center',
    },
    {
      title: 'KYC Time',
      dataIndex: 'KYCTime',

      align: 'center',
    },
    {
      title: 'Agent ID',
      dataIndex: 'AgentID',

      align: 'center',
    },
    {
      title: 'Agent Email',
      dataIndex: 'Agentemail',

      align: 'center',
    },
    {
      title: 'Agent Name/Last Name',
      dataIndex: 'AgentNameLastname',

      align: 'center',
    },
    {
      title: 'KYC Status',
      dataIndex: 'KYCStatus',

      align: 'center',
    },
    {
      title: 'Consumer Wallet ID',
      dataIndex: 'Consumerwalletid',

      align: 'center',
    },
    {
      title: 'KYC Response',
      dataIndex: 'KYCRespond',

      align: 'center',
    },
    {
      title: 'DOPA Response',
      dataIndex: 'DOPARespond',

      align: 'center',
    },
    {
      title: 'Agent Type',
      dataIndex: 'AgentID',

      align: 'center',
      render: (value, row, index) => {
        return (
          <span>
            {value === 'Agent1' ||
            value === 'KycTablet1' ||
            value === 'AgKycTablet2ent1' ||
            value === 'Tassana.kyc'
              ? 'TMDS'
              : 'TCRB'}
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
                  eKYC Monthly Report
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header text-left">
                {' '}
                Report of month : {month}
              </div>
              <div className="card-body">
                <div className="form-group">
                  <div className="col-sm-12 fl text-left">
                    <input
                      onChange={(e) => setMonth(e.target.value)}
                      type="month"
                      id="txtDate"
                      name="txtDate"
                      value={month}
                    />
                    <span>&nbsp;</span>
                    <Button
                      style={{
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                      }}
                      value="large"
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={() => {
                        searchData(monthstr)
                        fetchDataTmdskyc(monthstr)
                        fetchDataTcrbkyc(monthstr)
                      }}
                    >
                      Search
                    </Button>
                    <span>&nbsp;</span>
                    {
                      <Spin spinning={loading} tip="loading...">
                        <Table
                          columns={columns}
                          dataSource={data}
                          scroll={{ y: '57vh' }}
                          exportableProps={{
                            fileName: 'eKYC-Monthly-report',
                            className: 'tb-ant-export-style',
                            children: <span>Export</span>,
                            btnProps: {
                              type: 'primary',
                            },
                          }}
                        />
                      </Spin>
                    }
                  </div>
                  <br />
                  <br />
                </div>
                <div className="text-left">
                  <strong>TMDS eKYC</strong> : {tmdsKycAll.toLocaleString('en')}{' '}
                  <br />
                  <strong>TCRB eKYC</strong> : {tcrbKycAll.toLocaleString('en')}{' '}
                  <br />
                  <strong>Total Count</strong> :{' '}
                  {totalCount.toLocaleString('en')} <br />
                  <strong>TCRB eKYCX Total Amount</strong> :{' '}
                  {tcrbTotalAmount.toLocaleString('en')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Ekycmonthlyreport
