import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Form, DatePicker, Button, notification } from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import moment from 'moment'
import * as dayjs from 'dayjs'
import swal from 'sweetalert'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'

const Reportcustomeramlo = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [date, setDate] = useState()
  const [data, setData] = useState([])
  const [type, setType] = useState('New')
  const [dateActive, setDateActive] = useState()

  const ChangeDate = (date, dateString) => {
    setDate(dateString)
  }

  const ChangeDateActive = (date, dateString) => {
    setDateActive(dateString)
  }

  const DownloadNewCustomer = async () => {
    setType('New')
    if (date === '') {
      swal({
        title: 'Error',
        text: 'Please select date',
        icon: 'error',
        button: 'close',
      })
      return
    }
    try {
      const axios = getAxios({ access_token })
      const respNewCusAmlo = await axios.get(
        `/api/v1/reports/amlo/downloadAmloCustomer?date=${date}&type=${type}&activedate=${dateActive}`,
      )
      const { data: newcusamlo } = respNewCusAmlo
      const { data } = newcusamlo
      setData(data)
      document.querySelector('#button-download-as-xls').click()
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Download new customer amlo has error : ${message} `,
      })
    }
  }

  const DownloadOldCustomer = async () => {
    setType('Old')
    if (date === '') {
      swal({
        title: 'Error',
        text: 'Please select date',
        icon: 'error',
        button: 'close',
      })
      return
    }
    try {
      const axios = getAxios({ access_token })
      const respNewCusAmlo = await axios.get(
        `/api/v1/reports/amlo/downloadAmloCustomer?date=${date}&type=${type}`,
      )
      const { data: newcusamlo } = respNewCusAmlo
      const { data } = newcusamlo

      setData(data)

      document.querySelector('#button-download-as-xls').click()
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Download new customer amlo has error : ${message} `,
      })
    }
  }

  let Rank3 = 0
  let Rank2 = 0
  let Rank1 = 0
  let i = 0
  let Sumrank = 0
  const renderTable = () => {
    return data.map((newcusamlo) => {
      let Rank =
        newcusamlo.TransactionFactorRank > newcusamlo.CurrentRank
          ? newcusamlo.TransactionFactorRank
          : newcusamlo.CurrentRank
      let RegisterDate = dayjs(newcusamlo.RegisDate).format('DD/MM/YYYY')
      i++
      if (Rank === 3) {
        Rank3++
      }
      if (Rank === 2) {
        Rank2++
      }
      if (Rank === 1) {
        Rank1++
      }
      Sumrank = Sumrank + Rank3 + Rank2 + Rank1
      return (
        <tr>
          <td></td>
          <td>{i}</td>
          <td align="center" style={{ fontSize: '11px' }}>
            {newcusamlo.WalletID.substring(0, 3)}-
            {newcusamlo.WalletID.substring(5, 3)}-
            {newcusamlo.WalletID.substring(6, 5)}-
            {newcusamlo.WalletID.substring(6, 14)}-
            {newcusamlo.WalletID.substring(15, 14)}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {newcusamlo.Name}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {RegisterDate}
          </td>
          <td align="center" style={{ fontSize: '11px' }}>
            {newcusamlo.StatusRanking === 'New' ? 'A' : 'U'}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {newcusamlo.LastDateCalRank}
          </td>
          <td align="center" style={{ fontSize: '11px' }}>
            {newcusamlo.LastRank}
          </td>
          <td align="center" style={{ fontSize: '11px' }}>
            {Rank}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {newcusamlo.NextDateCalRank}
          </td>
        </tr>
      )
    })
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body1">
              <div className="form-group">
                <div className="col-sm-12">
                  <Form
                    name="frm_customer_report"
                    layout="inline"
                    style={{ padding: '15px' }}
                  >
                    <Form.Item>
                      <label>Last review date : </label>
                      <DatePicker onChange={ChangeDateActive} />
                    </Form.Item>
                    <Form.Item>
                      <label>Next review date : </label>
                      <DatePicker onChange={ChangeDate} />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          DownloadNewCustomer()
                        }}
                      >
                        Download New Customer
                      </Button>
                      &nbsp;
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: '#28a745',
                          borderColor: '#28a745',
                        }}
                        onClick={() => {
                          DownloadOldCustomer()
                        }}
                      >
                        Download Old Customer
                      </Button>
                    </Form.Item>
                  </Form>

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
                          <th className="bgblue text-white"></th>

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
                          <th className="bgblue text-white"></th>

                          <th colSpan="3" style={{ fontSize: '12px' }}>
                            Risk grading (new customer) daily report as{' '}
                            {dayjs(date).format('DD/MM/YYYY')}
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
                              Wallet no.
                            </th>
                            <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '200px' }}
                            >
                              Name-Surname
                            </th>
                            <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Active date
                            </th>
                            <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Status
                            </th>
                            <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Last review date
                            </th>
                            <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Last grade
                            </th>
                            <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Current grade
                            </th>
                            <th
                              className="text-center bgblue text-white"
                              style={{ fontWeight: 'normal', width: '150px' }}
                            >
                              Next review date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {renderTable()}
                          {/* {loading ? (
                            renderTable()
                          ) : (
                            // <Spin animation="border"></Spin>
                          )} */}
                          <tr>
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
                          )}
                        </tbody>
                      </table>
                      <ReactHTMLTableToExcel
                        className="btn btn-success"
                        table="table-to-xls"
                        filename="AmloCustomer"
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
    </div>
  )
}
export default Reportcustomeramlo
