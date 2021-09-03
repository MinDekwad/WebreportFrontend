import React, { useContext, useState, useCallback, useEffect } from 'react'
import {
  Form,
  notification,
  Input,
  Spin,
  Select,
  InputNumber,
  Button,
  Table,
  Modal,
  Popconfirm,
} from 'antd'
import { UserContext } from '../../userContext'
import { getAxios, getErrorMessage } from '../../Services'
import { useLocation, useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import * as dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'

const { Option } = Select

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Transactionfactoredit = () => {
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

  const [transacdtionTypes, setTransacdtionTypes] = useState()
  const [paymentChannels, setPaymentChannels] = useState()
  const [paymentTypes, setPaymentTypes] = useState()

  const [formData, setFormData] = useState(null)
  const [updateDate, setUpdateDate] = useState('')

  const [trasacItem, setTrasacItem] = useState()
  //const [loading, setLoading] = useState(false)
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [visibleEdit, setVisibleEdit] = React.useState(false)
  const [confirmLoadingEdit, setConfirmLoadingEdit] = React.useState(false)
  const [editTransacID, setEditTransacID] = useState()
  //const [confirmLoadingDel, setConfirmLoadingDel] = React.useState(false)

  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [rank, setRank] = useState('')

  const [datamin, SetDataMin] = useState()
  const [datamax, SetDataMax] = useState()
  const [datarank, SetDataRank] = useState()

  const ChangeMin = (value) => {
    setMin(value)
  }
  const ChangeMax = (value) => {
    setMax(value)
  }
  const ChangeRank = (value) => {
    setRank(value)
  }

  const ChangeDataMin = (value) => {
    SetDataMin(value)
  }
  const ChangeDataMax = (value) => {
    SetDataMax(value)
  }
  const ChangeDataRank = (value) => {
    SetDataRank(value)
  }

  const fecthDataTransactionType = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseTransactionType = await axios.get(
      //   `/api/v1/reports/point/transactionType`,
      // )
      const responseTransactionType = await axios({
        method: 'get',
        url: `/api/v1/reports/point/transactionType`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: transactionType } = responseTransactionType
      const { data: transactionTypes } = transactionType
      setTransacdtionTypes(transactionTypes)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data transaction type error : ${message}`,
      })
    }
  }

  const fecthDataPaymentChannel = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responsePaymentChannel = await axios.get(
      //   `/api/v1/reports/point/paymentChannel`,
      // )
      const responsePaymentChannel = await axios({
        method: 'get',
        url: `/api/v1/reports/point/paymentChannel`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: paymentChannel } = responsePaymentChannel
      const { data: paymentChannels } = paymentChannel
      setPaymentChannels(paymentChannels)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data payment channel error ${message}`,
      })
    }
  }

  const fecthDataPaymentType = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responsePaymentType = await axios.get(
      //   `/api/v1/reports/point/paymentType`,
      // )
      const responsePaymentType = await axios({
        method: 'get',
        url: `/api/v1/reports/point/paymentType`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: paymentType } = responsePaymentType
      const { data: paymentTypes } = paymentType
      setPaymentTypes(paymentTypes)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data payment type error ${message}`,
      })
    }
  }

  const fetchDataTransactionFactor = useCallback(async () => {
    if (editId === '') return
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responData = await axios.get(
        `/api/v1/reports/amlo/transactionFactor?id=${editId}`,
      )
      const { data } = responData.data
      const updateDate = dayjs(data.UpdateDate).format('YYYY-MM-DD')
      setUpdateDate(updateDate)
      setFormData({
        transactionFactorName: data.TransactionFactorName,
        transactionType: data.TransactionType,
        paymentChannel: data.PaymentChannel,
        paymentType: data.PaymentType,
        day: data.NumDay,
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data point transaction error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  const fetchDataTrasacItem = useCallback(async () => {
    if (editId === '') return
    setLoading(true)
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/amlo/dataTrasacItem?id=${editId}`,
      )
      let { data } = responseData.data
      console.log(data)
      data = data.map((d, i) => {
        return {
          key: `${i}`,
          ...d,
        }
      })
      setTrasacItem(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get transaction factor item error : ${message}`,
      })
    }
    setLoading(false)
  }, [])

  const AddAnotherItem = () => {
    setVisible(true)
  }
  const handleOk = async () => {
    if (min === '' || min < 1) {
      swal({
        title: 'Error',
        text: 'Please insert min geter then 1',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (max === '' || max < 0) {
      swal({
        title: 'Error',
        text: 'Please insert max',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (rank === '' || rank <= 0 || rank > 3) {
      swal({
        title: 'Error',
        text: 'Please insert rank to correct',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (editId === '') return
    setConfirmLoading(true)
    try {
      let PostData = {
        Min: min,
        Max: max,
        Rank: rank,
      }
      const axios = getAxios({ access_token })
      const responseDataTrasacItemTmp = await axios.put(
        `/api/v1/reports/amlo/createTransactionFactorItem?id=${editId}`,
        PostData,
      )
      const data = responseDataTrasacItemTmp.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoading(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          fetchDataTrasacItem()
          setVisible(false)
          setConfirmLoading(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Save transaction item error : ${message}`,
      })
      setConfirmLoading(false)
    }
  }
  const handleCancel = () => {
    setVisible(false)
  }

  const SaveTransactionFactor = (values) => {
    if (trasacItem === '') {
      swal({
        title: 'Error',
        text: 'Please add transaction',
        icon: 'error',
        button: 'close',
      })
      return
    }
    //console.log(values)
    const formData = { ...values }

    SaveData(
      formData.transactionFactorName,
      formData.transactionType,
      formData.paymentChannel,
      formData.paymentType,
      formData.day,
    )
  }

  const SaveData = async (
    transactionFactorName,
    transactionType,
    paymentChannel,
    paymentType,
    day,
  ) => {
    if (editId === '') return
    setLoading(true)
    try {
      let PostData = {
        TransactionFactorName: transactionFactorName,
        TransactionType: transactionType,
        PaymentChannel: paymentChannel,
        PaymentType: paymentType,
        Day: day,
      }
      //console.log(PostData)
      const axios = getAxios({ access_token })
      const responseData = await axios.put(
        `/api/v1/reports/amlo/editTransactionFactor?id=${editId}&date=${updateDate}`,
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
          pathname: '/Amlo/Transactionfactor',
        })
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status})Create point transacdtion error : ${message}`,
      })
    }
    setLoading(false)
  }

  const fetchDataTransactionItem = useCallback(async (id) => {
    try {
      const axios = getAxios({ access_token })
      const responseData = await axios.get(
        `/api/v1/reports/amlo/transactionItemPer?id=${id}`,
      )
      let { data } = responseData.data
      let Min = data.Min
      let Max = data.Max
      let Rank = data.Rank
      SetDataMin(Min)
      SetDataMax(Max)
      SetDataRank(Rank)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get edit transacdtion item per has error : ${message}`,
      })
    }
  }, [])

  const onEdit = (id) => {
    setVisibleEdit(true)
    setEditTransacID(id)
    fetchDataTransactionItem(id)
  }
  const handleOkEdit = async () => {
    console.log('editTransacID ', editTransacID)
    if (datamin === '' || datamin < 1) {
      swal({
        title: 'Error',
        text: 'Please insert min geter then 1',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (datamax === '' || datamax < 0) {
      swal({
        title: 'Error',
        text: 'Please insert max',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (datarank === '' || datarank <= 0 || datarank > 3) {
      swal({
        title: 'Error',
        text: 'Please insert rank to correct',
        icon: 'error',
        button: 'close',
      })
      return
    }
    if (editTransacID === '') return
    setConfirmLoadingEdit(true)
    try {
      let PostData = {
        Min: datamin,
        Max: datamax,
        Rank: datarank,
      }
      const axios = getAxios({ access_token })
      const responseDataTrasacItem = await axios.put(
        `/api/v1/reports/amlo/editTransactionFactorItemPer?id=${editTransacID}`,
        PostData,
      )
      const data = responseDataTrasacItem.data
      const message = data.message
      if (message !== 'success') {
        notification.warning({
          message: 'Sorry, something went wrong',
          descriptions: message,
        })
        setConfirmLoadingEdit(false)
        return true
      }
      swal({
        title: 'Done!',
        text: 'Save Success',
        icon: 'success',
        button: 'close',
      }).then(() => {
        setTimeout(() => {
          fetchDataTrasacItem()
          setVisibleEdit(false)
          setConfirmLoadingEdit(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Save transaction item error : ${message}`,
      })
      setConfirmLoading(false)
    }
  }
  const handleCancelEdit = () => {
    let Min = undefined
    let Max = undefined
    let Rank = undefined
    SetDataMin(Min)
    SetDataMax(Max)
    SetDataRank(Rank)
    setVisibleEdit(false)
  }

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
        `/api/v1/reports/amlo/delTransactionFactorItemPer?id=${id}`,
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
          fetchDataTrasacItem()
          //setVisibleEdit(false)
          setConfirmLoadingDel(false)
        }, 1000)
      })
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Delete occupation data has error : ${message} `,
      })
    }
    setConfirmLoadingDel(false)
  }
  const handleCancelDel = () => {
    setVisibleDel(false)
  }

  useEffect(() => {
    fetchDataTransactionFactor()
    fecthDataTransactionType()
    fecthDataPaymentChannel()
    fecthDataPaymentType()
    fetchDataTrasacItem()
  }, [])

  const columns = [
    {
      title: 'MIN',
      dataIndex: 'Min',
    },
    {
      title: 'MAX',
      dataIndex: 'Max',
    },
    {
      title: 'Rank',
      dataIndex: 'Rank',
    },
    {
      title: 'Edit',
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
      title: 'Delete',
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
      <Modal
        title="Insert min, max and rank edit"
        visible={visibleEdit}
        onOk={handleOkEdit}
        confirmLoading={confirmLoadingEdit}
        onCancel={handleCancelEdit}
      >
        {datamin !== undefined && (
          <Form.Item name="datamin" label="MIN" style={{ width: '100%' }}>
            <InputNumber
              style={{ width: '100%' }}
              onChange={ChangeDataMin}
              defaultValue={datamin}
            />
          </Form.Item>
        )}
        &nbsp;
        {datamax !== undefined && (
          <Form.Item name="datamax" label="MAX" style={{ width: '100%' }}>
            <InputNumber
              style={{ width: '100%' }}
              onChange={ChangeDataMax}
              defaultValue={datamax}
            />
          </Form.Item>
        )}
        &nbsp;
        {datarank !== undefined && (
          <Form.Item name="datarank" label="Rank" style={{ width: '100%' }}>
            <InputNumber
              style={{ width: '100%' }}
              onChange={ChangeDataRank}
              defaultValue={datarank}
            />
          </Form.Item>
        )}
      </Modal>
      <Modal
        title="Insert min, max and rank"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form.Item name="min" label="MIN" style={{ width: '100%' }}>
          <InputNumber style={{ width: '100%' }} onChange={ChangeMin} />
        </Form.Item>
        &nbsp;
        <Form.Item name="max" label="MAX" style={{ width: '100%' }}>
          <InputNumber style={{ width: '100%' }} onChange={ChangeMax} />
        </Form.Item>
        &nbsp;
        <Form.Item name="rank" label="Rank" style={{ width: '100%' }}>
          <InputNumber style={{ width: '100%' }} onChange={ChangeRank} />
        </Form.Item>
      </Modal>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <Spin spinning={loading} tip="loading..">
                {formData && (
                  <Form
                    {...layout}
                    name="frm_transactionfactorcreate"
                    //layout="inline"
                    style={{ textAlign: 'left' }}
                    onFinish={SaveTransactionFactor}
                    initialValues={{
                      ...formData,
                    }}
                  >
                    <Form.Item
                      name="transactionFactorName"
                      label="Transactionfactor Name"
                      rules={[{ required: true }]}
                      style={{ width: '100%' }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="day"
                      label="Day(number)"
                      rules={[{ required: true }]}
                      style={{ width: '100%' }}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="transactionType"
                      label="Transaction Type"
                      rules={[{ required: true }]}
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      <Select>
                        {transacdtionTypes &&
                          transacdtionTypes.map((d) => {
                            //const { id, name } = d
                            return <Option key={d}>{d}</Option>
                          })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="paymentChannel"
                      label="Payment Channel"
                      rules={[{ required: true }]}
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      <Select>
                        {paymentChannels &&
                          paymentChannels.map((d) => {
                            return <Option key={d}>{d}</Option>
                          })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="paymentType"
                      label="Payment Type"
                      rules={[{ required: true }]}
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      <Select>
                        {paymentTypes &&
                          paymentTypes.map((d) => {
                            return <Option key={d}>{d}</Option>
                          })}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          AddAnotherItem()
                        }}
                      >
                        Add another item
                      </Button>
                      &nbsp;
                      <Button
                        //disabled={!transactionFactorName ? true : false}
                        type="primary"
                        htmlType="submit"
                        button
                      >
                        Submit
                      </Button>
                    </Form.Item>
                    <div className="col-sm-12">
                      <Table
                        columns={columns}
                        dataSource={trasacItem}
                        scroll={{ y: '57vh' }}
                      />
                    </div>
                  </Form>
                )}
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Transactionfactoredit
