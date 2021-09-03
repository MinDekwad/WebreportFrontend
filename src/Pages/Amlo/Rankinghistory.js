import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Table, notification, Spin } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import dayjs from 'dayjs'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Rankinghistory = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const query = useQuery()
  const walletID = query.get('walletID')
  //const history = useHistory()

  const [dataArea, setDataArea] = useState([])
  const [dataOccupation, setDataOccupation] = useState([])
  const [dataWatchlist, setDataWatchlist] = useState([])
  const [dataTransaction, setDataTransaction] = useState([])
  const [loading1, setLoading1] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [loading3, setLoading3] = useState(true)
  const [loading4, setLoading4] = useState(true)

  const [RankingDistrictNameTH, setRankingDistrictNameTH] = useState()
  const [RankingName, setRankingName] = useState()
  const [RankingOccupationName, setRankingOccupationName] = useState()
  const [RankingProvinceNameTH, setRankingProvinceNameTH] = useState()
  const [RankingSubDistrict, setRankingSubDistrict] = useState()
  const [RankingTaxID, setRankingTaxID] = useState()
  const [RankingZipCode, setRankingZipCode] = useState()
  const [RankingAddress, setRankingAddress] = useState()
  const [RankingPhoneno, setPhoneno] = useState()

  const fetchDataRankingHistory = useCallback(async () => {
    if (walletID === '') return
    setLoading1(true)
    try {
      const axios = getAxios({ access_token })
      const responDataRankingHistory = await axios.get(
        `/api/v1/reports/amlo/rankingHistory?walletID=${walletID}`,
      )
      //console.log(responDataRankingHistory)
      let data = responDataRankingHistory.data
      // let DistrictNameTH = data.data.DistrictNameTH
      // let Name = data.data.Name
      // let OccupationName = data.data.OccupationName
      // let ProvinceNameTH = data.data.ProvinceNameTH
      // let SubDistrict = data.data.SubDistrict
      // let TaxID = data.data.TaxID
      // let ZipCode = data.data.ZipCode

      setRankingDistrictNameTH(data.data.DistrictNameTH)
      setRankingName(data.data.Name)
      setRankingOccupationName(data.data.OccupationName)
      setRankingProvinceNameTH(data.data.ProvinceNameTH)
      setRankingSubDistrict(data.data.SubDistrict)
      setRankingTaxID(data.data.TaxID)
      setRankingZipCode(data.data.ZipCode)
      setRankingAddress(data.data.AddressDetail)
      setPhoneno(data.data.Phoneno)

      // data = data.map((d, i) => {
      //   return {
      //     key: `${i}`,
      //     ...d,
      //   }
      // })
      // setDataArea(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Get area history data error : ${message}`,
      })
    }
  }, [])

  const fetchDataRankingAreaHistory = useCallback(async () => {
    if (walletID === '') return
    setLoading1(true)
    try {
      const axios = getAxios({ access_token })
      const responDataAreaHistory = await axios.get(
        `/api/v1/reports/amlo/rankingAreaHistory?walletID=${walletID}`,
      )
      //console.log(responDataAreaHistory)
      let { data } = responDataAreaHistory.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setDataArea(data)
      setLoading1(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Get area history data error : ${message}`,
      })
    }
  }, [])

  const fetchDataRankingOccuptionHistory = useCallback(async () => {
    if (walletID === '') return
    setLoading2(true)
    try {
      const axios = getAxios({ access_token })
      const responDataOccupationHistory = await axios.get(
        `/api/v1/reports/amlo/rankingOccupationHistory?walletID=${walletID}`,
      )
      //console.log(responDataOccupationHistory)
      let { data } = responDataOccupationHistory.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setDataOccupation(data)
      setLoading2(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Get occupation history data error : ${message}`,
      })
    }
  }, [])

  const fetchDataRankingWatchlistHistory = useCallback(async () => {
    if (walletID === '') return
    setLoading3(true)
    try {
      const axios = getAxios({ access_token })
      const responDataWatchlistHistory = await axios.get(
        `/api/v1/reports/amlo/rankingWatchlistHistory?walletID=${walletID}`,
      )
      //console.log(responDataWatchlistHistory)
      let { data } = responDataWatchlistHistory.data
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
          StatusDel: d.StatusDel,
        }
      })
      setDataWatchlist(data)
      setLoading3(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Get occupation history data error : ${message}`,
      })
    }
  }, [])

  const fetchDataRankingTransactionHistory = useCallback(async () => {
    if (walletID === '') return
    setLoading4(true)
    try {
      const axios = getAxios({ access_token })
      const responDataTransactionHistory = await axios.get(
        `/api/v1/reports/amlo/rankingTransactionHistory?walletID=${walletID}`,
      )
      let { data } = responDataTransactionHistory.data
      data = data.map((d, i) => {
        const { edges } = d || { edges: {} }
        const { Transactionfactor } = edges || { Transactionfactor: {} }
        return {
          ...Transactionfactor,
          key: `${i}`,
          ...d,
        }
      })
      setDataTransaction(data)
      setLoading4(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Get transaction history data error : ${message}`,
      })
    }
  }, [])

  const columnsArea = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
    },
    {
      title: 'จังหวัด',
      dataIndex: 'ProvinceNameTH',
      align: 'left',
    },
    {
      title: 'เขต / อำเภอ(TH)',
      dataIndex: 'DistrictNameTH',
      align: 'left',
    },
    {
      title: 'แขวง / ตำบล',
      dataIndex: 'SubDistrict',
      align: 'left',
    },
    {
      title: 'ระดับความเสี่ยงด้านพื้นที่',
      dataIndex: 'RankArea',
      align: 'right',
    },
    {
      title: 'วันที่คำนวณความเสี่ยง',
      dataIndex: 'DateCalRank',
      align: 'left',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
    },
  ]

  const columnsOccupation = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
    },
    {
      title: 'อาชีพ',
      dataIndex: 'OccupationName',
      align: 'left',
    },
    {
      title: 'ระดับความเสี่ยงด้านอาชีพ',
      dataIndex: 'RankOccupation',
      align: 'right',
    },
    {
      title: 'วันที่คำนวณความเสี่ยง',
      dataIndex: 'DateCalRank',
      align: 'left',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
    },
  ]

  const columnsWatchlist = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
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
    },
    {
      title: 'ระดับความเสี่ยง',
      dataIndex: 'RankWatchlist',
      align: 'right',
    },
    {
      title: 'วันที่คำนวณความเสี่ยง',
      dataIndex: 'DateCalRank',
      align: 'left',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'StatusDel',
      align: 'left',
      render: (values) => {
        if (values === 1) {
          return <span>เป็นบุุคลในถัง Watchlist</span>
        } else {
          return <span style={{ color: 'red' }}>ถูกลบจาก Watchlist</span>
        }
      },
    },
  ]

  const columnsTransaction = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
    },
    {
      title: 'ชื่อทรานเซคชั่น',
      dataIndex: 'TransactionFactorName',
      align: 'left',
    },
    {
      title: 'ระดับความเสี่ยงด้านทรานเซคชั่น',
      dataIndex: 'RankTransactionFactor',
      align: 'right',
    },
    {
      title: 'วันที่คำนวณความเสี่ยง',
      dataIndex: 'DateCalRank',
      align: 'left',
      render: (value) => {
        return <span>{dayjs(value).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
    },
  ]

  useEffect(() => {
    fetchDataRankingHistory()
    fetchDataRankingAreaHistory()
    fetchDataRankingOccuptionHistory()
    fetchDataRankingWatchlistHistory()
    fetchDataRankingTransactionHistory()
  }, [])

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <br />
            <table
              style={{ width: '80%', textAlign: 'left', marginLeft: '25px' }}
            >
              <tr>
                <td style={{ width: '160px' }}>
                  <strong>Information</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>เลขที่ Wallet : </strong>
                </td>
                <td>{walletID}</td>
              </tr>
              <tr>
                <td>
                  <strong>ชื่อ นามสกุล : </strong>
                </td>
                <td>{RankingName}</td>
              </tr>
              <tr>
                <td>
                  <strong>เลขประจำตัวประชาชน : </strong>
                </td>
                <td>{RankingTaxID}</td>
              </tr>
              <tr>
                <td>
                  <strong>เบอร์โทร : </strong>
                </td>
                <td>{RankingPhoneno}</td>
              </tr>
              <tr>
                <td>
                  <strong>ที่อยู่ : </strong>
                </td>
                <td>
                  {RankingAddress} <strong>แขวง/ตำบล : </strong>
                  {RankingSubDistrict} <strong>เขต/อำเภอ : </strong>
                  {RankingDistrictNameTH} <strong>จังหวัด : </strong>
                  {RankingProvinceNameTH} <strong>รหัสไปรษณีย์ : </strong>
                  {RankingZipCode}
                </td>
              </tr>
            </table>
            {/* <span style={{ textAlign: 'left', padding: '0px 0px 0px 20px' }}>
              <label style={{ fontWeight: 'bold' }}>เลขที่ Wallet :</label>{' '}
              {walletID}
              <br />
              <label style={{ fontWeight: 'bold' }}>ชื่อ นามสกุล :</label>{' '}
              {RankingName}
              <br />
              <label style={{ fontWeight: 'bold' }}>
                เลขประจำตัวประชาชน :
              </label>{' '}
              {RankingTaxID}
              <br />
              <label style={{ fontWeight: 'bold' }}>
                ที่อยู่ :
              </label> จังหวัด: {RankingProvinceNameTH} เขต/อำเภอ:
              {RankingDistrictNameTH} แขวง/ตำบล: {RankingSubDistrict}{' '}
              รหัสไปรษณีย์: {RankingZipCode}
              <br />
              <label style={{ fontWeight: 'bold' }}>อาชีพ :</label>{' '}
              {RankingOccupationName}
            </span> */}
            <div className="card-body" style={{ minHeight: '50px' }}>
              {
                <Spin spinning={loading1} tip="Loading">
                  <Table
                    columns={columnsArea}
                    dataSource={dataArea}
                    scroll={{ y: '57vh' }}
                    bordered
                    title={() => 'Area History'}
                  />
                </Spin>
              }
            </div>
            <div className="card-body" style={{ minHeight: '50px' }}>
              {
                <Spin spinning={loading2} tip="Loading">
                  <Table
                    columns={columnsOccupation}
                    dataSource={dataOccupation}
                    scroll={{ y: '57vh' }}
                    bordered
                    title={() => 'Occupation History'}
                  />
                </Spin>
              }
            </div>
            <div className="card-body" style={{ minHeight: '50px' }}>
              {
                <Spin spinning={loading3} tip="Loading">
                  <Table
                    columns={columnsWatchlist}
                    dataSource={dataWatchlist}
                    scroll={{ y: '57vh' }}
                    bordered
                    title={() => 'Watchlist History'}
                  />
                </Spin>
              }
            </div>
            <div className="card-body" style={{ minHeight: '50px' }}>
              {
                <Spin spinning={loading4} tip="Loading">
                  <Table
                    columns={columnsTransaction}
                    dataSource={dataTransaction}
                    scroll={{ y: '57vh' }}
                    bordered
                    title={() => 'Transaction History'}
                  />
                </Spin>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Rankinghistory
