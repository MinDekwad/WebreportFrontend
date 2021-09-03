import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  notification,
  Spin,
  Popconfirm,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import swal from 'sweetalert'

const Waitinglist = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user

  const [loading, setLoading] = useState(true)

  // Area
  const [dataArea, setDataArea] = useState([])
  const fetchDataArea = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respDataArea = await axios.get(
      `/api/v1/reports/amlo/areaListWaitingApprove`,
    )
    let { data } = respDataArea.data
    data = data.map((d, i) => {
      return {
        ...d,
      }
    })
    setDataArea(data)
    setLoading(false)
  }
  // ApproveArea
  const [visibleApprove, setVisibleApprove] = React.useState(false)
  const [confirmLoadingApprove, setConfirmLoadingApprove] =
    React.useState(false)
  const showPopApprove = () => {
    setVisibleApprove(true)
  }
  const handleOkApprove = async (id) => {
    setConfirmLoadingApprove(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/approveArea?id=${id}&userData=${userData}`,
      )
      const data = responseData.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoadingApprove(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          setVisibleApprove(false)
          setConfirmLoadingApprove(false)
          window.location.reload(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Approve occupation data has error : ${message} `,
      })
    }
  }
  const handleCancelApprove = () => {
    setVisibleApprove(false)
  }
  const columnsArea = [
    {
      title: 'เขต/อำเภอ TH',
      dataIndex: 'DistrictNameTH',
      align: 'left',
    },
    {
      title: 'แขวง / ตำบล',
      dataIndex: 'SubDistrictNameTH',
      align: 'left',
    },
    {
      title: 'รหัสไปรษณีย์',
      dataIndex: 'ZipCode',
      align: 'right',
    },
    {
      title: 'คะแนนความเสี่ยง',
      dataIndex: 'Rank',
      align: 'right',
    },
    {
      title: 'คะแนนความเสี่ยง (Tmp)',
      dataIndex: 'RankTmp',
      align: 'right',
    },
    {
      title: 'Approve',
      key: 'Approve',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to approve"
          visibleApprove={visibleApprove}
          onConfirm={(e) => {
            handleOkApprove(record.id, e)
          }}
          okButtonProps={{ loading: confirmLoadingApprove }}
          onCancel={handleCancelApprove}
        >
          {userData === 'Theerayuth Thanarattanavichai' ? (
            <Button
              disabled={record.RankTmp === '-' ? true : false}
              type="primary"
              onClick={showPopApprove}
            >
              Approve
            </Button>
          ) : (
            '-'
          )}
        </Popconfirm>
      ),
    },
  ]
  //Area

  //Occupation
  const [dataOccu, setDataOccu] = useState([])
  const fetchDataOccu = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respDataOccu = await axios.get(
      `/api/v1/reports/amlo/occuListWaitingApprove`,
    )
    let { data } = respDataOccu.data
    data = data.map((d, i) => {
      return {
        ...d,
      }
    })
    setDataOccu(data)
    setLoading(false)
  }
  //Approve Occu
  const [visibleApproveOccu, setVisibleApproveOccu] = React.useState(false)
  const [confirmLoadingApproveOccu, setConfirmLoadingApproveOccu] =
    React.useState(false)
  const showPopApproveOccu = () => {
    setVisibleApproveOccu(true)
  }
  const handleOkApproveOccu = async (id) => {
    setConfirmLoadingApproveOccu(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/approveOccupation?id=${id}&userData=${userData}`,
      )
      const data = responseData.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoadingApproveOccu(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          setVisibleApproveOccu(false)
          setConfirmLoadingApproveOccu(false)
          window.location.reload(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Approve occupation data has error : ${message} `,
      })
    }
  }
  const handleCancelApproveOccu = () => {
    setVisibleApprove(false)
  }

  const columnsOccu = [
    {
      title: 'อาชีพ',
      dataIndex: 'OccupationName',
      align: 'left',
    },
    {
      title: 'คะแนนความเสี่ยง',
      dataIndex: 'Rank',
      align: 'right',
    },
    {
      title: 'คะแนนความเสี่ยง (Tmp)',
      dataIndex: 'RankTmp',
      align: 'right',
    },
    {
      title: 'Approve',
      key: 'Approve',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to approve"
          visibleApproveOccu={visibleApproveOccu}
          onConfirm={(e) => {
            handleOkApproveOccu(record.id, e)
          }}
          okButtonProps={{ loading: confirmLoadingApproveOccu }}
          onCancel={handleCancelApproveOccu}
        >
          {userData === 'Theerayuth Thanarattanavichai' ? (
            <Button
              disabled={record.RankTmp === '-' ? true : false}
              type="primary"
              onClick={showPopApproveOccu}
            >
              Approve
            </Button>
          ) : (
            '-'
          )}
        </Popconfirm>
      ),
    },
  ]

  //Transaction
  const [dataTransaction, setDataTransaction] = useState([])
  const fetchDataTransaction = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respDataTransaction = await axios.get(
      `/api/v1/reports/amlo/transactionListWaitingApprove`,
    )
    let { data } = respDataTransaction.data
    data = data.map((d, i) => {
      return {
        ...d,
      }
    })
    setDataTransaction(data)
    setLoading(false)
  }
  // Approve
  const [visibleApproveTran, setVisibleApproveTran] = React.useState(false)
  const [confirmLoadingApproveTran, setConfirmLoadingApproveTran] =
    React.useState(false)
  const showPopApproveTran = () => {
    setVisibleApproveTran(true)
  }
  const handleOkApproveTran = async (id) => {
    setConfirmLoadingApproveTran(true)
    try {
      const axios = getAxios({ access_token })
      const responseDataTran = await axios.post(
        `/api/v1/reports/amlo/approveTransaction?id=${id}`,
      )
      const data = responseDataTran.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoadingApproveTran(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          setVisibleApproveTran(false)
          setConfirmLoadingApproveTran(false)
          window.location.reload(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Approve transaction data has error : ${message} `,
      })
    }
  }
  const handleCancelApproveTran = () => {
    setVisibleApproveTran(false)
  }

  const columnsTran = [
    {
      title: 'ประเภท',
      dataIndex: 'TransactionFactorName',
      width: '50%',
      align: 'left',
    },
    {
      title: 'สถานะ',
      dataIndex: 'StatusApprove',
      width: '10%',
      align: 'left',
      render: (values) => {
        // if (values === 'Approve') {
        //   return <span>พร้อมใช้งาน</span>
        // } else {
        // return <span>รอยืนยัน</span>
        return <span>{values}</span>
        //}
      },
    },
    {
      title: 'Approve',
      key: 'Approve',
      align: 'center',
      width: '20%',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to approve"
          visibleApproveTran={visibleApproveTran}
          onConfirm={(e) => {
            handleOkApproveTran(record.id, e)
          }}
          okButtonProps={{ loading: confirmLoadingApproveTran }}
          onCancel={handleCancelApproveTran}
        >
          {userData === 'Theerayuth Thanarattanavichai' ? (
            <Button
              disabled={record.StatusApprove === 'Waiting' ? false : true}
              type="primary"
              onClick={showPopApprove}
            >
              Approve
            </Button>
          ) : (
            '-'
          )}
        </Popconfirm>
      ),
    },
  ]

  useEffect(() => {
    fetchDataArea()
    fetchDataOccu()
    fetchDataTransaction()
  }, [])

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                {
                  <Spin spinning={loading} tip="Loading">
                    <Table
                      columns={columnsArea}
                      dataSource={dataArea}
                      scroll={{ y: '57vh' }}
                    />
                    <Table
                      columns={columnsOccu}
                      dataSource={dataOccu}
                      scroll={{ y: '57vh' }}
                    />
                    <Table
                      columns={columnsTran}
                      dataSource={dataTransaction}
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
  )
}
export default Waitinglist
