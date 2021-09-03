import React, { useContext, useEffect, useState } from 'react'
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
} from 'antd'
import { EditOutlined, CheckOutlined } from '@ant-design/icons'
import swal from 'sweetalert'
import { useHistory, useLocation } from 'react-router-dom'
import * as dayjs from 'dayjs'
import { Parser } from 'json2csv'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'

const { Option } = Select

const today = dayjs().format('YYYY-MM-DD')

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Area = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const { userData } = user
  let history = useHistory()

  const query = useQuery()
  let provinceNameTHs = query.get('provinceNameTH')

  const [provinceNameTH, setProvinceNameTH] = useState()
  const [provinceNameTHSearch, setProvinceNameTHSearch] = useState()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [data3, setData3] = useState([])

  //console.log(provinceNameTHSearch)

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

  const searchData = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respOccupation = await axios.get(
      `/api/v1/reports/amlo/areaListSearch?provincenameth=${provinceNameTHSearch}`,
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

  const searchData2 = async (provinceNameTHs) => {
    setLoading(true)
    const axios = getAxios({ access_token })
    const respOccupation = await axios.get(
      `/api/v1/reports/amlo/areaListSearch?provincenameth=${provinceNameTHs}`,
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

  // if (provinceNameTHs !== null) {
  //   ChangeProvince(provinceNameTHs)
  // let link = document.querySelector('#btnSearch')
  // if (link) {
  //   let target = link.getAttribute('id')
  //   if (target === 'btnSearch') {
  //     searchData()
  //   }
  // }
  //console.log('btn ', btn)
  //}

  const onEdit = (id) => {
    history.push({
      pathname: '/Amlo/Areaedit',
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
        `/api/v1/reports/amlo/approveArea?id=${id}`,
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

  const intervalCheckProgress = async (id) => {
    const timechkData = setInterval(
      async () => {
        try {
          const axios = getAxios({ access_token })
          const responseAreaStatus = await axios.get(
            `/api/v1/reports/amlo/status/area?request_id=${id}`,
          )
          const { data: AreaStatus } = responseAreaStatus
          const { data } = AreaStatus
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
            message: `(${status}) Get status area error : ${message}`,
          })
        }
      },
      5000,
      [],
    )
  }

  const CalculateRankArea = async () => {
    setLoading(true)
    const axios = getAxios({ access_token })

    const respCalculateRankByArea = await axios({
      method: 'post',
      url: `/api/v1/reports/amlo/calculate/area?name=${provinceNameTHSearch}`,
      // method: 'post',
      // url: `/api/v1/reports/amlo/calculateRank?provincename=${provinceNameTHSearch}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300 * 1000,
    })
    const data = respCalculateRankByArea.data
    const message = data.message
    const data2 = data.data
    const id = data2.id
    if (message === 'success') {
      intervalCheckProgress(id)
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

  const DownloadListArea = async () => {
    setLoading(true)
    let day = today
    try {
      const axios = getAxios({ access_token })
      const respArea = await axios.get(`/api/v1/reports/amlo/areaList`)
      //let { data } = respArea.data

      const { data: resparea } = respArea
      const { data } = resparea

      setData3(data)
      document.querySelector('#button-download-as-xls').click()
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Dowload occupation csv error : ${message}`,
      })
    }
    setLoading(false)
  }

  // const DownloadListArea = async () => {
  //   let day = today
  //   try {
  //     const axios = getAxios({ access_token })
  //     const respArea = await axios.get(`/api/v1/reports/amlo/areaList`)
  //     let { data } = respArea.data
  //     data = data.map((d, i) => {
  //       return {
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
  //     fields: [
  //       'ProvinceNameTH',
  //       'DistrictNameTH',
  //       'SubDistrictNameTH',
  //       'ZipCode',
  //       'Rank',
  //     ],
  //   }
  //   const parser = new Parser(opts)
  //   const csv = parser.parse(data)
  //   const url = window.URL.createObjectURL(new Blob(['\uFEFF', csv]))
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', `AREA_${day}.csv`)
  //   document.body.appendChild(link)
  //   link.click()
  //   link.parentNode.removeChild(link)
  // }

  let i = 0
  const renderTable = () => {
    return data3.map((resparea) => {
      i++
      return (
        <tr>
          <td></td>
          <td>{i}</td>
          <td align="left" style={{ fontSize: '11px' }}>
            {resparea.ProvinceNameTH}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {resparea.DistrictNameTH}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {resparea.SubDistrictNameTH}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {resparea.ZipCode}
          </td>
          <td align="right" style={{ fontSize: '11px' }}>
            {resparea.Rank}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {/* {resparea.ApproveDate} */}
            {resparea.ApproveDate !== undefined
              ? resparea.ApproveDate.substring(0, 10)
              : ''}
          </td>
          <td align="left" style={{ fontSize: '11px' }}>
            {resparea.ApproveBy}
          </td>
        </tr>
      )
    })
  }

  useEffect(() => {
    fecthDataProvinceNameTH()
    if (provinceNameTHs !== null) {
      searchData2(provinceNameTHs)
    }
  }, [])

  const columns = [
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
    // {
    //   title: 'Approve',
    //   key: 'Approve',
    //   align: 'center',
    //   render: (_, record) => (
    //     <Popconfirm
    //       title="Are you sure to approve"
    //       visibleApprove={visibleApprove}
    //       onConfirm={(e) => {
    //         handleOkApprove(record.id, e)
    //       }}
    //       okButtonProps={{ loading: confirmLoadingApprove }}
    //       onCancel={handleCancelApprove}
    //     >
    //       {userData === 'Theerayuth Thanarattanavichai' ? (
    //         <Button
    //           disabled={record.RankTmp === '-' ? true : false}
    //           type="primary"
    //           onClick={showPopApprove}
    //         >
    //           Approve
    //         </Button>
    //       ) : (
    //         '-'
    //       )}
    //     </Popconfirm>
    //   ),
    // },
  ]

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <Form
                  name="frm_occupation"
                  layout="inline"
                  style={{ textAlign: 'left' }}
                >
                  <Form.Item
                    //name="provinceNameTH"
                    label="จังหวัด"
                    rules={[{ required: true }]}
                    style={{ width: '20%', textAlign: 'left' }}
                  >
                    <Select onChange={ChangeProvince} showSearch>
                      {provinceNameTH &&
                        provinceNameTH.map((d) => {
                          //const { id, name } = d
                          return <Option key={d}>{d}</Option>
                        })}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        searchData()
                      }}
                      id="btnSearch"
                      //value="cl"
                    >
                      Search
                    </Button>
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
                  <Form.Item>
                    <Button
                      value="large"
                      type="primary"
                      onClick={() => {
                        DownloadListArea()
                      }}
                    >
                      Download
                    </Button>
                  </Form.Item>
                </Form>
                <br />
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
                          รายงานระดับความเสี่ยงตามพื้นที่ ณ วันที่{' '}
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
                            จังหวัด
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            อำเภอ/เขต
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '200px' }}
                          >
                            ตำบล/แขวง
                          </th>
                          <th
                            className="text-center bgblue text-white"
                            style={{ fontWeight: 'normal', width: '150px' }}
                          >
                            รหัสไปรษณีย์
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
                      filename="ReportAreaRanking"
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
export default Area
