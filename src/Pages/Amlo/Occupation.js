import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
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
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import swal from 'sweetalert'
import queryString, { stringify } from 'query-string'
import * as dayjs from 'dayjs'
import { Parser } from 'json2csv'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'

const { Option } = Select

const today = dayjs().format('YYYY-MM-DD')

const Occupation = () => {
  let history = useHistory()

  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user

  const [occupationName, setOccupationName] = useState('')
  const [rank, setRank] = useState('')

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [data3, setData3] = useState([])

  const onEdit = (id) => {
    history.push({
      pathname: '/Amlo/Occupationedit',
      search: '?id=' + id,
    })
  }

  const ChangeRank = (value) => {
    setRank(value)
  }

  ////////////////
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
        `/api/v1/reports/amlo/delOccupation?id=${id}`,
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
          setVisibleDel(false)
          setConfirmLoadingDel(false)
          window.location.reload(false)
        }, 2000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Delete occupation data has error : ${message} `,
      })
    }
  }
  const handleCancelDel = () => {
    setVisibleDel(false)
  }
  ///////////////

  ///////////
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
        `/api/v1/reports/amlo/approveOccupation?id=${id}`,
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

  const searchData = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respOccupation = await axios.get(
      `/api/v1/reports/amlo/occupationListSearch?occupationname=${occupationName}&rank=${rank}`,
    )
    let { data } = respOccupation.data
    data = data.map((d, i) => {
      return {
        ...d,
      }
    })
    setData(data)
    setLoading(false)
  }

  const fetchDataOccupationList = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/amlo/occupationList`,
      )
      let { data } = responseData.data
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

  // occupation
  const [selectedFile, setSelectedFile] = useState()
  //const [loading, setLoading] = useState(false)
  const [FileName, setFileName] = useState()

  const [statusSaveCSV, setStatusSaveCSV] = useState('error')
  const [statusUpdateCSV, setStatusUpdateCSV] = useState('error')

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0])
    let filename = event.target.files[0]?.name
    fetchDataUserProfileAmloName(filename)
  }

  const fetchDataUserProfileAmloName = async (filename) => {
    try {
      const axios = getAxios({ access_token })
      const responseUserProfileAmloName = await axios.get(
        `/api/v1/reports/csv/userProfileAmloName?filename=${filename}`,
      )
      const { data: CountUserProfileAmloName } = responseUserProfileAmloName
      const { data } = CountUserProfileAmloName

      if (data !== 0) {
        swal({
          title: 'Error',
          text: 'This file already exists',
          icon: 'error',
          button: 'close',
        })
        return
      }
      setFileName(filename)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get file name user profile amlo csv error  : ${message}`,
      })
    }
  }

  const intervalCheckProgress = async (filename) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseUserProfileAmloFileimport = await axios.get(
            `/api/v1/reports/csv/userProfileAmloFileimportStatus?filename=${filename}`,
          )
          const { data: UserProfileAmloFileimport } =
            responseUserProfileAmloFileimport
          const { data } = UserProfileAmloFileimport
          let status = data.user_profile_amlo_fileimport_status

          let statusSaveCsv = status
          setStatusSaveCSV(statusSaveCsv)

          if (status === 'Success') {
            clearInterval(timechkData)
            setLoading(false)
            swal({
              title: 'Done!',
              text: 'Save Success',
              icon: 'success',
              button: 'close',
            })
          }
        } catch (err) {
          const { status, message } = getErrorMessage(err)
          notification.warning({
            message: `(${status}) Get status file import user profile amlo csv error : ${message}`,
          })
        }
      },
      5000,
      [],
    )
  }

  const SaveCSVData = async (filename) => {
    setLoading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)

    const axios = getAxios({ access_token })
    const {
      data: { message },
    } = await axios({
      method: 'post',
      url: '/api/v1/reports/csv/upload/userprofileamlocsv',
      // url: '/api/v1/reports/amlo/upload/userprofileamlocsv',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30 * 1000,
    })
    if (message === 'success') {
      intervalCheckProgress(filename)
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

  const CalculateRankOccupation = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })

    const respCalculateRankByOccu = await axios({
      method: 'post',
      url: `/api/v1/reports/amlo/calculate/occu`,
      // method: 'post',
      // url: `/api/v1/reports/amlo/calculateRank?provincename=${provinceNameTHSearch}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300 * 1000,
    })
    const data = respCalculateRankByOccu.data
    const message = data.message
    const data2 = data.data
    const id = data2.id
    if (message === 'success') {
      intervalCheckProgressCalcuOccu(id)
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

  const intervalCheckProgressCalcuOccu = async (id) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseOccuStatus = await axios.get(
            `/api/v1/reports/amlo/status/occu?request_id=${id}`,
          )
          //console.log(responseAreaStatus)
          const { data: OccuStatus } = responseOccuStatus
          const { data } = OccuStatus
          //console.log(data)
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
            message: `(${status}) Get status occupation error : ${message}`,
          })
        }
      },
      5000,
      [],
    )
  }

  // const DownloadListOccu = async () => {
  //   let day = today
  //   try {
  //     const axios = getAxios({ access_token })
  //     const responseData = await axios.get(
  //       `/api/v1/reports/amlo/occupationList`,
  //     )
  //     let { data } = responseData.data
  //     data = data.map((d, i) => {
  //       return {
  //         key: `${i}`,
  //         ...d,
  //       }
  //     })
  //     downloadCSV(data, day)
  //     setLoading(false)
  //   } catch (err) {
  //     const { status, message } = getErrorMessage(err)
  //     notification.warning({
  //       message: `(${status}) Dowload occupation csv error : ${message}`,
  //     })
  //     setLoading(false)
  //   }
  // }

  // const downloadCSV = (data, day) => {
  //   const opts = {
  //     fields: ['OccupationName', 'Rank'],
  //   }
  //   const parser = new Parser(opts)
  //   const csv = parser.parse(data)
  //   const url = window.URL.createObjectURL(new Blob(['\uFEFF', csv]))
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', `OCCUPATION_${day}.csv`)
  //   document.body.appendChild(link)
  //   link.click()
  //   link.parentNode.removeChild(link)
  // }

  const DownloadListOccu = async () => {
    setLoading(true)
    let day = today
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/amlo/occupationList`,
      )
      //let { data } = responseData.data
      const { data: respoccu } = responseData
      const { data } = respoccu
      setData3(data)
      document.querySelector('#button-download-as-xls').click()
      // data = data.map((d, i) => {
      //   return {
      //     key: `${i}`,
      //     ...d,
      //   }
      // })
      // setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Dowload occupation csv error : ${message}`,
      })
    }
    setLoading(false)
  }

  let i = 0
  const renderTable = () => {
    return data3.map((respoccu) => {
      i++
      return (
        <tr>
          <td></td>
          <td>{i}</td>
          <td align="left" style={{ fontSize: '11px' }}>
            {respoccu.OccupationName}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {respoccu.Rank}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {respoccu.ApproveDate !== undefined
              ? respoccu.ApproveDate.substring(0, 10)
              : ''}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {respoccu.ApproveBy}
          </td>
        </tr>
      )
    })
  }

  useEffect(() => {
    fetchDataOccupationList()
  }, [])

  const columns = [
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
    // {
    //   title: 'คะแนนความเสี่ยง (Tmp)',
    //   dataIndex: 'RankTmp',
    //   align: 'right',
    // },
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
      title: '#',
      key: 'Delete',
      align: 'center',
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
  ]

  return (
    <div>
      <div className="row">
        <div className="col-sm-12"></div>
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <Form
                  name="frm_occupation"
                  layout="inline"
                  style={{ textAlign: 'left' }}
                >
                  <Form.Item>
                    <Input
                      name="occupationName"
                      placeholder="อาชีพ"
                      value={occupationName}
                      label="อาชีพ"
                      onChange={(event) =>
                        setOccupationName(event.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item label="ระดับความเสี่ยง">
                    <Select defaultValue="" onChange={ChangeRank}>
                      <Option value="">All</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                    </Select>
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      searchData()
                    }}
                  >
                    Search
                  </Button>
                  &nbsp;
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: '#52c41a',
                      border: '#52c41a',
                    }}
                    onClick={() => {
                      history.push({
                        pathname: '/Amlo/Occupationcreate',
                      })
                    }}
                  >
                    Create New Occopation
                  </Button>
                  &nbsp;
                  <Button
                    value="large"
                    type="primary"
                    onClick={() => {
                      DownloadListOccu()
                    }}
                  >
                    Download
                  </Button>
                  &nbsp;
                  <Button
                    type="primary"
                    onClick={() => {
                      CalculateRankOccupation()
                    }}
                  >
                    Calculate
                  </Button>
                </Form>
                {
                  <Spin spinning={loading} tip="Loading">
                    <Table
                      columns={columns}
                      dataSource={data}
                      scroll={{ y: '57vh' }}
                    />
                  </Spin>
                }
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
                          รายงานระดับความเสี่ยงด้านอาชีพ ณ วันที่{' '}
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
                            OccupationName
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            Rank
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            Approved date
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            Approved by
                          </th>
                        </tr>
                      </thead>
                      <tbody>{renderTable()}</tbody>
                    </table>
                    <ReactHTMLTableToExcel
                      className="btn btn-success"
                      table="table-to-xls"
                      filename="ReportOccupationRanking"
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
export default Occupation
