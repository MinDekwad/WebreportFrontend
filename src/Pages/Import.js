import React, { useState, useContext } from 'react'
//import { UserContext } from '../../userContext'
import {
  Card,
  Row,
  Col,
  Table,
  Upload,
  Button,
  Tag,
  Space,
  message as Message,
  PageHeader,
  notification,
} from 'antd'
import axios from 'axios'
import { FileTextOutlined, CheckOutlined } from '@ant-design/icons'

const merchantHost = process.env.REACT_APP_HOST || ''

const getColor = (status) => {
  return status === 'NEW'
    ? 'gold'
    : status === 'VERIFIED'
    ? 'green'
    : status === 'ONLINE'
    ? 'blue'
    : 'cyan'
}

const staticColumns = [
  {
    title: 'IDx',
    key: 'id',
    dataIndex: 'id',
    sorter: (a, b) => {
      return a.id > b.id
    },
  },
  {
    title: 'MerchantFullName',
    key: 'merchant_full_name',
    dataIndex: 'merchant_full_name',
  },
  {
    title: 'MerchantShortNameTH',
    key: 'merchant_short_name_th',
    dataIndex: 'merchant_short_name_th',
    ellipsis: true,
  },
  {
    title: 'MerchantShortNameEN',
    key: 'merchant_short_name_en',
    dataIndex: 'merchant_short_name_en',
  },
  { title: 'MobilePhone', key: 'mobile_phone', dataIndex: 'mobile_phone' },
  {
    title: 'KindOfBusiness',
    key: 'kind_of_business',
    dataIndex: 'kind_of_business',
  },
  {
    title: 'Settlement Acc',
    key: 'settlement_account',
    dataIndex: 'settlement_account',
  },
  {
    title: 'SettlementType',
    key: 'settlement_type',
    dataIndex: 'settlement_type',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    sorter: (a, b) => {
      return a.status > b.status
    },
    render: (status) => {
      return (
        <>
          <Tag color={getColor(status)}>{status}</Tag>
        </>
      )
    },
  },
]

function Import() {
  const [loading, setLoading] = useState(false)
  const [merchant, setMerchant] = useState([])
  const [requestID, setRequestID] = useState('')
  const [totalRows, setTotalRows] = useState(0)
  const [paging, setPaging] = useState({ perPage: 25, page: 1 })

  //   const {
  //     user: { access_token: accessToken },
  //   } = useContext(UserContext)

  const customRequest = ({
    file,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {
    const formData = new FormData()
    formData.append('file', file)
    axios
      .post(`${merchantHost}/merchants/csv/imports`, formData, {
        withCredentials,
        //headers: { ...headers, Authorization: `Bearer ${accessToken}` },
        onUploadProgress: ({ total, loaded }) => {
          onProgress(
            { percent: Math.round((loaded / total) * 100).toFixed(2) },
            file,
          )
        },
      })
      .then(({ data: response }) => {
        onSuccess(response, file)
        setLoading(false)
        const { data, count, request_id } = response

        const newData = data.map((d) => {
          const { id } = d
          return { ...d, key: id }
        })

        setTotalRows(count)
        setMerchant(newData)
        setRequestID(request_id)
      })
      .catch((err) => {
        onError(err)
        setLoading(false)
        const { data } = err.response
        notification.warn({ message: data.message })
      })
    return {
      abort() {
        console.log('upload progress is aborted.')
      },
    }
  }

  const confirm = async () => {
    setLoading(true)
    try {
      const response = await axios({
        url: `/merchants/csv/confirm`,
        baseURL: merchantHost,
        method: 'post',
        data: {
          request_id: requestID,
          data: merchant,
        },
        // headers: {
        //   Authorization: `Bearer ${accessToken}`,
        // },
      })

      notification.success({ message: `Import csv ${totalRows} rows success` })
      setRequestID('')
      setMerchant([])
    } catch (error) {
      const { response } = error || {}
      const {
        status,
        data: { message },
      } = response || {}
      Message.warn(`(${status}) ${message || error.message}`)
    }
    setLoading(false)
  }

  return (
    <>
      <Row align="middle" justify="center">
        <Col>
          <Card
            title={`Import Merchants`}
            extra={
              <Space>
                <Upload
                  method="post"
                  name="file"
                  customRequest={customRequest}
                  multiple={false}
                  showUploadList={false}
                >
                  <Button type="default" icon={<FileTextOutlined />}>
                    Upload file
                  </Button>
                </Upload>
                <Button
                  type="primary"
                  disabled={merchant.length < 1}
                  icon={<CheckOutlined />}
                  onClick={() => confirm()}
                >
                  Confirm
                </Button>
              </Space>
            }
          >
            <Table
              columns={staticColumns}
              loading={loading}
              dataSource={merchant}
              pagination={{
                current: paging.page,
                pageSize: paging.perPage,
                onChange: (page, pageSize) => {
                  setPaging({ perPage: pageSize, page })
                },
                showSizeChanger: true,
              }}
            />
            <PageHeader
              subTitle={`total : ${totalRows} records, request id : ${requestID}`}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default Import
