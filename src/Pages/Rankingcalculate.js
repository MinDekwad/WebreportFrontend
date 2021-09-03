import React, { useState, useCallback, useContext, useEffect } from 'react'
import swal from 'sweetalert'
import { notification, Result, Spin, Button, Form, Select, Table } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { SaveOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

const { Option } = Select

const Rankingcalculate = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  let history = useHistory()

  // occupation
  const [selectedFile, setSelectedFile] = useState()
  const [loading, setLoading] = useState(false)
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

  // const UpdateRankOccupation = async () => {
  //   setLoading(true)
  //   const axios = getAxios({ access_token })
  //   const respUpdateRankByOccupation = await axios.get(
  //     `/api/v1/reports/amlo/updateRankingOccupation`,
  //   )
  //   //console.log(respUpdateRankByOccupation)
  //   const data = respUpdateRankByOccupation.data
  //   //const message = data.message
  //   const message = data.message

  //   let statusUpdateCsv = message
  //   setStatusUpdateCSV(statusUpdateCsv)

  //   if (message !== 'success') {
  //     notification.warning({
  //       message: 'Sorry, something went wrong',
  //       descriptions: message,
  //     })
  //     setLoading(false)
  //     return true
  //   }
  //   swal({
  //     title: 'Done!',
  //     text: 'Save Success',
  //     icon: 'success',
  //     button: 'close',
  //   })
  //   setLoading(false)
  // }

  const CalculateRankOccupation = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    // const respCalculateRankByOccupation = await axios.get(
    //   `/api/v1/reports/amlo/calculateRankingByOccupation`,
    // )
    const respCalculateRankByOccupation = await axios({
      method: 'get',
      url: `/api/v1/reports/amlo/calculateRankingByOccupation`,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 50 * 1000,
    })
    const data = respCalculateRankByOccupation.data
    const message = data.message
    if (message !== 'success') {
      notification.warning({
        message: 'Sorry, something went wrong',
        descriptions: message,
      })
      setLoading(false)
      return true
    }
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

  // area
  const [provinceNameTH, setProvinceNameTH] = useState()
  const [provinceNameTHSearch, setProvinceNameTHSearch] = useState()
  const [dataArea, setDataArea] = useState([])

  const fecthDataProvinceNameTH = async () => {
    try {
      const axios = getAxios({ access_token })
      const responseProvinceNameTH = await axios.get(
        `/api/v1/reports/amlo/provinceNameTH`,
      )
      const { data: ProvinceNameTH } = responseProvinceNameTH
      const { data: ProvinceNameTHs } = ProvinceNameTH
      setProvinceNameTH(ProvinceNameTHs)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data province name error : ${message}`,
      })
    }
  }

  const ChangeProvince = (value) => {
    setProvinceNameTHSearch(value)
  }
  // const searchDataArea = async () => {
  //   setLoading(true)
  //   const axios = getAxios({ access_token })
  //   const respOccupation = await axios.get(
  //     `/api/v1/reports/amlo/areaListSearch?provincenameth=${provinceNameTHSearch}`,
  //   )
  //   let { data } = respOccupation.data
  //   data = data.map((d, i) => {
  //     return {
  //       ...d,
  //     }
  //   })
  //   setDataArea(data)
  //   setLoading(false)
  // }

  const CalculateRankArea = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respCalculateRankByArea = await axios.get(
      `/api/v1/reports/amlo/calculateRankingByArea?name=${provinceNameTHSearch}`,
    )
    const data = respCalculateRankByArea.data
    const message = data.message
    if (message !== 'success') {
      notification.warning({
        message: 'Sorry, something went wrong',
        descriptions: message,
      })
      setLoading(false)
      return true
    }
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

  //const CalculateRankArea = async (id) => {
  // setLoading(true)
  // const axios = getAxios({ access_token })
  // const respCalculateRankByArea = await axios.get(
  //   `/api/v1/reports/amlo/calculateRankingByArea?id=${id}`,
  // )
  // console.log(respCalculateRankByArea)
  // const data = respCalculateRankByArea.data
  // const message = data.message
  // if (message !== 'success') {
  //   notification.warning({
  //     message: 'Sorry, something went wrong',
  //     descriptions: message,
  //   })
  //   setLoading(false)
  //   return true
  // }
  // swal({
  //   title: 'Done!',
  //   text: 'Save Success',
  //   icon: 'success',
  //   button: 'close',
  // }).then(() => {
  //   setTimeout(() => {
  //     history.push({
  //       pathname: '/Ranking',
  //     })
  //   }, 1000)
  // })
  // setLoading(false)
  //}

  // watchlist
  const [dataWatchlist, setDataWatchlist] = useState([])

  const fetchDataWatchList = useCallback(async () => {
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(`/api/v1/reports/amlo/watchlist`)
      console.log(responseData)
      let { data } = responseData.data
      data = data.map((d, i) => {
        const { edges } = d || { edges: {} }
        const { related } = edges || { related: {} }
        return {
          ...related,
          key: `${i}`,
          ...d,
        }
      })
      setDataWatchlist(data)
      setLoading(false)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get all data watchlist error : ${message}`,
      })
      setLoading(false)
    }
  }, [])

  const CalculateRankWatchlist = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respCalculateRankByWatchlist = await axios.get(
      `/api/v1/reports/amlo/calculateRankingByWatchlist`,
    )
    const data = respCalculateRankByWatchlist.data
    const message = data.message
    if (message !== 'success') {
      notification.warning({
        message: 'Sorry, something went wrong',
        descriptions: message,
      })
      setLoading(false)
      return true
    }
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

  const CalculateRankTransaction = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    // const respCalculateRankByTransaction = await axios.get(
    //   `/api/v1/reports/amlo/calculateRankingByTransaction`,
    // )
    const respCalculateRankByTransaction = await axios({
      method: 'get',
      url: `/api/v1/reports/amlo/calculateRankingByTransaction`,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60 * 1000,
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

  useEffect(() => {
    fecthDataProvinceNameTH()
    fetchDataWatchList()
  }, [])

  // const columnsArea = [
  //   {
  //     title: 'ชื่อเขต/อำเภอ TH',
  //     dataIndex: 'DistrictNameTH',
  //     align: 'center',
  //   },
  //   {
  //     title: 'ชื่อเขต/อำเภอ EN',
  //     dataIndex: 'DistrictNameEN',
  //     align: 'center',
  //   },
  //   {
  //     title: 'Ranking',
  //     dataIndex: 'Rank',
  //     align: 'center',
  //   },
  //   {
  //     title: 'Calculate',
  //     key: 'Calculate',
  //     align: 'center',
  //     render: (_, record) => (
  //       <Button
  //         type="primary"
  //         onClick={(e) => {
  //           CalculateRankArea(record.id, e)
  //         }}
  //       >
  //         Calculate
  //       </Button>
  //     ),
  //   },
  // ]

  // watchlist
  const columnsWatchist = [
    {
      title: 'ชื่อ นามสกุล',
      dataIndex: 'Name',
      align: 'left',
    },
    {
      title: 'TaxID / เลขประจำตัวประชาชน',
      dataIndex: 'TaxID',
      align: 'right',
      //width: '20%',
    },
    {
      title: 'ประเภท',
      dataIndex: 'TypeName',
      align: 'left',
      // width: '15%',
    },
  ]

  return (
    <div>
      {/* {
        <Spin spinning={loading} tip="Loading"> */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Calculate rank by occupation</div>
            <div className="card-body1" style={{ padding: '25px' }}>
              <form style={{ float: 'left', textAlign: 'left' }}>
                <h5 className="m-0">Upload User Profile CSV</h5>
                <br />
                <input
                  type="file"
                  name="file"
                  onChange={changeHandler}
                  style={{ width: '400px' }}
                />
                <br />
                <br />
                <Button
                  //disabled={!FileName ? true : false}
                  type="primary"
                  onClick={() => {
                    SaveCSVData(FileName)
                  }}
                >
                  Upload
                </Button>
                {/* &nbsp;
                    <Button
                      disabled={statusSaveCSV !== 'Success' ? true : false}
                      type="primary"
                      onClick={() => {
                        UpdateRankOccupation()
                      }}
                    >
                      Update
                    </Button> */}
                &nbsp;
                <Button
                  //disabled={statusUpdateCSV !== 'success' ? true : false}
                  type="primary"
                  onClick={() => {
                    CalculateRankOccupation()
                  }}
                >
                  Calculate
                </Button>
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Calculate rank by area</div>
            <div className="card-body1" style={{ padding: '25px' }}>
              <Form
                name="frm_occupation"
                layout="inline"
                style={{ textAlign: 'left' }}
              >
                <Form.Item
                  label="จังหวัด"
                  rules={[{ required: true }]}
                  style={{ width: '20%', textAlign: 'left' }}
                >
                  <Select onChange={ChangeProvince}>
                    {provinceNameTH &&
                      provinceNameTH.map((d) => {
                        return <Option key={d}>{d}</Option>
                      })}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      // searchDataArea()
                      CalculateRankArea()
                    }}
                  >
                    Calculate
                  </Button>
                </Form.Item>
              </Form>
              {/* <br />
                  {
                    <Spin spinning={loading} tip="Loading">
                      <Table
                        columns={columnsArea}
                        dataSource={dataArea}
                        scroll={{ y: '57vh' }}
                      />
                    </Spin>
                  } */}
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Calculate rank watchlist</div>
            <div className="card-body1" style={{ padding: '25px' }}>
              <Form
                name="frm_watchlist"
                layout="inline"
                style={{ textAlign: 'left' }}
              >
                <Button
                  disabled={!dataWatchlist ? true : false}
                  type="primary"
                  onClick={() => {
                    CalculateRankWatchlist()
                  }}
                  style={{ float: 'left' }}
                >
                  Calculate
                </Button>
              </Form>
              {
                <Spin spinning={loading} tip="Loading">
                  <Table
                    columns={columnsWatchist}
                    dataSource={dataWatchlist}
                    scroll={{ y: '57vh' }}
                  />
                </Spin>
              }
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Calculate rank by transaction</div>
            <div className="card-body1" style={{ padding: '25px' }}>
              <Form
                name="frm_transaction"
                layout="inline"
                style={{ textAlign: 'left' }}
              >
                {/* <Form.Item
                      label="จังหวัด"
                      rules={[{ required: true }]}
                      style={{ width: '20%', textAlign: 'left' }}
                    >
                      <Select onChange={ChangeProvince}>
                        {provinceNameTH &&
                          provinceNameTH.map((d) => {
                            return <Option key={d}>{d}</Option>
                          })}
                      </Select>
                    </Form.Item> */}
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      // searchDataArea()
                      CalculateRankTransaction()
                    }}
                  >
                    Calculate
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <br />
      {/* </Spin>
      } */}
    </div>
  )
}
export default Rankingcalculate
