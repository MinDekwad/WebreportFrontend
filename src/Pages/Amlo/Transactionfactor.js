import React, { useContext, useEffect, useState, useCallback } from 'react'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import {
  Form,
  Button,
  notification,
  Select,
  Spin,
  Popconfirm,
  Table,
  Card,
} from 'antd'
import swal from 'sweetalert'
import { useHistory } from 'react-router-dom'
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'

const Transactionfactor = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user
  let history = useHistory()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  //const [confirmLoadingDel, setConfirmLoadingDel] = React.useState(false)

  const fetchDataTransactionFactor = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/amlo/transactionfactorList`,
      )
      let { data } = responseData.data
      console.log(data)
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setData(data)
      setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data occupation error : ${message}`,
      })
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDataTransactionFactor()
  }, [])

  const onEdit = (id) => {
    history.push({
      pathname: '/Amlo/Transactionfactoredit',
      search: '?id=' + id,
    })
  }

  // const onDel = async (id) => {
  //   setConfirmLoadingDel(true)
  //   try {
  //     const axios = getAxios({ access_token })
  //     const responseData = await axios.post(
  //       `/api/v1/reports/amlo/delTransactionFactor?id=${id}`,
  //     )

  //     const data = responseData.data
  //     const message = data.message

  //     if (message !== 'success') {
  //       notification.warning({
  //         message: 'Sorry, something went wrong',
  //         descriptions: message,
  //       })
  //       setConfirmLoadingDel(false)
  //       return true
  //     }
  //     swal({
  //       title: 'Done!',
  //       text: 'Save Success',
  //       icon: 'success',
  //       button: 'close',
  //     }).then(() => {
  //       setTimeout(() => {
  //         window.location.reload(false)
  //       }, 2000)
  //     })
  //   } catch (err) {
  //     const { status, message } = getErrorMessage(err)
  //     notification.warning({
  //       message: `(${status}) Delete transaction factor has error : ${message} `,
  //     })
  //   }
  //   setConfirmLoadingDel(false)
  // }

  // delete
  const [visibleDel, setVisibleDel] = React.useState(false)
  const [confirmLoadingDel, setConfirmLoadingDel] = React.useState(false)
  const showPopDel = () => {
    setVisibleDel(true)
  }
  const handleOkDel = async (id) => {
    setConfirmLoadingDel(true)
    setConfirmLoadingDel(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/delTransactionFactor?id=${id}`,
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
          window.location.reload(false)
        }, 2000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Delete transaction factor has error : ${message} `,
      })
    }
    setConfirmLoadingDel(false)
  }
  const handleCancelDel = () => {
    setVisibleDel(false)
  }

  const CalculateRankTransaction = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })

    const respCalculateRankByTransaction = await axios({
      method: 'post',
      url: `/api/v1/reports/amlo/calculate/transaction`,
      //url: `/api/v1/reports/amlo/calculateRank?transacfac=call`,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300 * 1000,
    })
    const data = respCalculateRankByTransaction.data
    const message = data.message
    const data2 = data.data
    const id = data2.id
    if (message === 'success') {
      intervalCheckProgressCalcuTF(id)
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

  const intervalCheckProgressCalcuTF = async (id) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseTFStatus = await axios.get(
            `/api/v1/reports/amlo/status/tf?request_id=${id}`,
          )
          const { data: TFStatus } = responseTFStatus
          const { data } = TFStatus
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
            message: `(${status}) Get status transaction error : ${message}`,
          })
        }
      },
      5000,
      [],
    )
  }

  /*
  const CalculateRankTransaction = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    // const respCalculateRankByTransaction = await axios.get(
    //   `/api/v1/reports/amlo/calculateRankingByTransaction`,
    // )
    const respCalculateRankByTransaction = await axios({
      method: 'get',
      url: `/api/v1/reports/amlo/calculateRankingByTransaction`,
      //url: `/api/v1/reports/amlo/calculateRank?transacfac=call`,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300 * 1000,
    })
    // const data = respCalculateRankByTransaction.data
    // const message = data.message
    // if (message !== 'success') {
    //   notification.warning({
    //     message: 'Sorry, something went wrong',
    //     descriptions: message,
    //   })
    //   setLoading(false)
    //   return true
    // }
    swal({
      title: 'Done!',
      text: 'Save Success',
      icon: 'success',
      button: 'close',
    }).then(() => {
      setTimeout(() => {
        history.push({
          pathname: '/Ranking',
        })
      }, 1000)
    })
    setLoading(false)
  }
  */

  // Approve
  const [visibleApprove, setVisibleApprove] = React.useState(false)
  const [confirmLoadingApprove, setConfirmLoadingApprove] =
    React.useState(false)
  const showPopApprove = () => {
    setVisibleApprove(true)
  }
  const handleOkApprove = async (id) => {
    console.log(id)
    setConfirmLoadingApprove(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.post(
        `/api/v1/reports/amlo/approveTransaction?id=${id}`,
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
        message: `(${status}) Approve transaction data has error : ${message} `,
      })
    }
  }
  const handleCancelApprove = () => {
    setVisibleApprove(false)
  }

  const columns = [
    {
      title: 'ประเภท',
      dataIndex: 'TransactionFactorName',
      width: '50%',
      align: 'left',
    },
    {
      title: '#',
      key: 'Edit',
      align: 'center',
      width: '10%',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(e) => {
            onEdit(record.id, e)
          }}
        ></Button>
      ),
    },
    {
      title: '#',
      key: 'Delete',
      align: 'center',
      width: '10%',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete"
          visibleDel={visibleDel}
          //onConfirm={handleOk}
          onConfirm={(e) => {
            handleOkDel(record.id, e)
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
    {
      title: 'สถานะ',
      dataIndex: 'StatusApprove',
      width: '10%',
      align: 'left',
      render: (values) => {
        if (values === 'Approve') {
          return <span>พร้อมใช้งาน</span>
        } else {
          return <span>รอยืนยัน</span>
        }
      },
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
                  name="frm_transaction"
                  layout="inline"
                  //style={{ textAlign: 'left' }}
                >
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        history.push({
                          pathname: '/Amlo/Transactionfactorcreate',
                        })
                      }}
                    >
                      Create Transaction
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        CalculateRankTransaction()
                      }}
                    >
                      Calculate
                    </Button>
                  </Form.Item>
                </Form>
                <Spin spinning={loading} tip="Loading">
                  <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{ y: '57vh' }}
                  />
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Transactionfactor
