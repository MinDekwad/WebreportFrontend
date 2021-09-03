import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Form, notification, Input, Spin, Select, Button } from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { useLocation, useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import * as dayjs from 'dayjs'

const { Option } = Select

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Areaedit = () => {
  let RankDB = ''
  let rankDB = ''
  let rankTmpDB = ''
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  }

  const { user } = useContext(UserContext)
  const { access_token } = user || {}
  const [loading, setLoading] = useState(false)
  const query = useQuery()
  const editId = query.get('id')
  const history = useHistory()

  const [formData, setFormData] = useState(null)
  const [updateDate, setUpdateDate] = useState('')

  const fetchDataEdit = useCallback(async () => {
    if (editId === '') return
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responData = await axios.get(
        `/api/v1/reports/amlo/area?id=${editId}`,
      )
      const { data } = responData.data
      console.log(data)
      const updateDate = dayjs(data.UpdateDate).format('YYYY-MM-DD')
      setUpdateDate(updateDate)
      rankDB = data.Rank
      rankTmpDB = data.RankTmp
      if (rankDB === '-') {
        RankDB = rankTmpDB
      } else {
        RankDB = rankDB
      }
      setFormData({
        provinceNameTH: data.ProvinceNameTH,
        districtNameTH: data.DistrictNameTH,
        //districtNameEN: data.DistrictNameEN,
        subDistrictNameTH: data.SubDistrictNameTH,
        rank: RankDB,
      })
      setLoading(false)
    } catch {}
  }, [])

  const SaveArea = async (values) => {
    const PostData = { ...values }
    const provinceNameTH = PostData.provinceNameTH
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.put(
        `/api/v1/reports/amlo/editArea?id=${editId}&date=${updateDate}`,
        PostData,
      )
      setLoading(false)
      const data = responseData.data
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
        history.push({
          pathname: '/Amlo/Area',
          search: '?provinceNameTH=' + provinceNameTH,
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Edit config area error : ${message}`,
      })
    }
  }

  useEffect(() => {
    fetchDataEdit()
  }, [])

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Edit Area
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <Spin spinning={loading} tip="loading..">
                  {formData && (
                    <Form
                      {...layout}
                      name="frm-edit-area"
                      onFinish={SaveArea}
                      initialValues={{
                        ...formData,
                        rank: formData.rank,
                      }}
                    >
                      <Form.Item
                        name="provinceNameTH"
                        label="จังหวัด"
                        rules={[{ required: true }]}
                        style={{ width: '100%' }}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        name="districtNameTH"
                        label="เขต/อำเภอ(TH)"
                        rules={[{ required: true }]}
                        style={{ width: '100%' }}
                      >
                        <Input disabled />
                      </Form.Item>
                      {/* <Form.Item
                        name="districtNameEN"
                        label="เขต/อำเภอ(EN)"
                        rules={[{ required: true }]}
                        style={{ width: '100%' }}
                      >
                        <Input disabled />
                      </Form.Item> */}

                      <Form.Item
                        name="subDistrictNameTH"
                        label="แขวง/ตำบล"
                        rules={[{ required: true }]}
                        style={{ width: '100%' }}
                      >
                        <Input disabled />
                      </Form.Item>
                      <Form.Item
                        name="rank"
                        label="Rank :"
                        rules={[{ required: true }]}
                      >
                        <Select style={{ width: '100%', textAlign: 'left' }}>
                          <Option key="1">1</Option>
                          <Option key="2">2</Option>
                          <Option key="3">3</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          button
                          style={{ float: 'right' }}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Areaedit
