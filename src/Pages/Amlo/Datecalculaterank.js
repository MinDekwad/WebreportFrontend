import React, { useState, useCallback, useEffect, useContext } from 'react'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { Button, notification, Spin, Popconfirm, Table } from 'antd'
import { EditOutlined, CheckOutlined } from '@ant-design/icons'
import swal from 'sweetalert'
import { useHistory } from 'react-router-dom'

const Datecalculaterank = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user

  let history = useHistory()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fecthDataDateCalculateRank = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const respDateCalculateRank = await axios.get(
        `/api/v1/reports/amlo/dateCalculateRankList`,
      )
      let { data } = respDateCalculateRank.data
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
        message: `(${status}) Get all data date calculate rank error : ${message}`,
      })
      setLoading(false)
    }
  }, [])

  const onEdit = (id) => {
    history.push({
      pathname: '/Amlo/Datecalculaterankedit',
      search: '?id=' + id,
    })
  }

  // Approve
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
        `/api/v1/reports/amlo/approveDateCalculateRank?id=${id}`,
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
  ///////////

  useEffect(() => {
    fecthDataDateCalculateRank()
  }, [])

  const columns = [
    {
      title: 'คะแนนความเสี่ยง',
      dataIndex: 'Rank',
      align: 'right',
    },
    {
      title: 'ระยะเวลาทวบทวน(จำนวนวัน)',
      dataIndex: 'NumDateCalculateRank',
      align: 'right',
    },
    {
      title: 'ระยะเวลาทวบทวน(Tmp)',
      dataIndex: 'NumDateCalculateRankTmp',
      align: 'right',
    },
    {
      title: '#',
      key: 'Edit',
      align: 'center',
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
              disabled={record.NumDateCalculateRankTmp === '-' ? true : false}
              type="primary"
              onClick={showPopApprove}
            >
              Approve
            </Button>
          ) : (
            '-'
          )}
          {/* <Button
            disabled={record.NumDateCalculateRankTmp === '-' ? true : false}
            type="primary"
            onClick={showPopApprove}
          >
            Approve
          </Button> */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Datecalculaterank
