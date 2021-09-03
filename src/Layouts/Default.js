import React, { useState, useContext } from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
  FileTextOutlined,
  TransactionOutlined,
  DownloadOutlined,
  ImportOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  DiffOutlined,
  DollarOutlined,
  CarryOutOutlined,
  SettingOutlined,
  ContactsOutlined,
  GlobalOutlined,
  ScheduleOutlined,
  AreaChartOutlined,
  FileExclamationOutlined,
  SearchOutlined,
  UploadOutlined,
  PauseOutlined,
} from '@ant-design/icons'
import { UserContext } from '../userContext'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu
const version = process.env.REACT_APP_VERSION || '0.0.0'

const DefaultLayout = ({ children }) => {
  const subMenu = []
  const menu = []
  const [collapsed, setCollapsed] = useState(false)
  const [width, setWidth] = useState('width:500px !important')
  const { isAllowed } = useContext(UserContext)

  return (
    <Layout
      className="layout"
      style={{ minHeight: '100vh', backgroundColor: '#fff' }}
    >
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={() => {
          setCollapsed(!collapsed)
        }}
      >
        <div
          className="logo"
          style={{ width: '70%', margin: 'auto', padding: '0px 0px 10px 0px' }}
        >
          <img src="logo.svg" alt="" />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={menu}
          defaultOpenKeys={subMenu}
          mode="inline"
        >
          {isAllowed('dailyReport') && (
            <Menu.Item key="dailyreport" icon={<FileTextOutlined />}>
              <Link to="/Dailyreport">Dailyreport</Link>
            </Menu.Item>
          )}

          {isAllowed('statementEndingBalance') && (
            <Menu.Item key="Liststatementending" icon={<TransactionOutlined />}>
              <Link to="/Statement/Liststatementending">
                Statement Ending Balance
              </Link>
            </Menu.Item>
          )}

          {isAllowed('bulkTransaction') && (
            <Menu.Item key="Listbulktransaction" icon={<TransactionOutlined />}>
              <Link to="/Bulk/Listbulktransaction">Bulk Transaction</Link>
            </Menu.Item>
          )}

          {isAllowed('eKycMonthly') && (
            <Menu.Item key="Ekycmonthlyreport" icon={<DownloadOutlined />}>
              <Link to="/Ekyc/Ekycmonthlyreport">eKYC monthly report</Link>
            </Menu.Item>
          )}

          {isAllowed('importsCSV') && (
            <Menu.Item key="Importcsv" icon={<ImportOutlined />}>
              <Link to="/Importcsv">Import csv</Link>
            </Menu.Item>
          )}

          {(isAllowed('billpaymentTransaction') ||
            isAllowed('billpaymentSummary')) && (
            <SubMenu
              key="Billpayment"
              title={
                <span>
                  <UnorderedListOutlined />
                  <span>Bill payment</span>
                </span>
              }
            >
              {isAllowed('billpaymentTransaction') && (
                <Menu.Item
                  key="bill-transaction"
                  icon={<TransactionOutlined />}
                >
                  <Link to="/Billpay/Billpaytransaction">Transaction</Link>
                </Menu.Item>
              )}
              {isAllowed('billpaymentSummary') && (
                <Menu.Item key="bill-summary" icon={<DiffOutlined />}>
                  <Link to="/Billpay/Billpaysummary">Summary</Link>
                </Menu.Item>
              )}
            </SubMenu>
          )}

          {(isAllowed('pointTransactionList') ||
            isAllowed('pointLimit') ||
            isAllowed('pointCalculate') ||
            isAllowed('exportPointCSV') ||
            isAllowed('pointHistory') ||
            isAllowed('pointHistoryExport')) && (
            <SubMenu
              key="Point"
              title={
                <span>
                  <UnorderedListOutlined />
                  <span>Point</span>
                </span>
              }
            >
              {(isAllowed('pointTransactionList') ||
                isAllowed('pointLimit') ||
                isAllowed('pointCalculate')) && (
                <Menu.Item key="Pointgen" icon={<DollarOutlined />}>
                  <Link to="../Point/Pointgen">Gen point</Link>
                </Menu.Item>
              )}

              {(isAllowed('exportPointCSV') || isAllowed('pointHistory')) && (
                <Menu.Item key="Pointhistory" icon={<TransactionOutlined />}>
                  <Link to="../Point/Pointhistory">Point transaction</Link>
                </Menu.Item>
              )}

              {isAllowed('pointHistoryExport') && (
                <Menu.Item key="Pointhistoryexport" icon={<FileTextOutlined />}>
                  <Link to="../Point/Pointhistoryexport">Export history</Link>
                </Menu.Item>
              )}
            </SubMenu>
          )}

          {isAllowed('pointKYCLB') && (
            <SubMenu
              key="Pointkcyrv"
              title={
                <span>
                  <UnorderedListOutlined />
                  <span>Point KYC and LB</span>
                </span>
              }
            >
              <Menu.Item key="Pointkyclbgen" icon={<DollarOutlined />}>
                <Link to="/Pointkyclb/Pointkyclbgen">Gen point</Link>
              </Menu.Item>
              <Menu.Item key="Pointimport" icon={<ImportOutlined />}>
                <Link to="/Pointkyclb/Pointimport">Import point pending</Link>
              </Menu.Item>
            </SubMenu>
          )}

          {isAllowed('updateReportKYC') && (
            <Menu.Item key="updatereportkyc" icon={<FileTextOutlined />}>
              <Link to="/Updatereportkyc">Update report kyc</Link>
            </Menu.Item>
          )}

          {/* AMLO */}
          {isAllowed('compliance') && (
            <SubMenu
              key="Amlo"
              title={
                <span>
                  <UnorderedListOutlined />
                  <span>Amlo</span>
                </span>
              }
            >
              <Menu.Item key="ranking" icon={<AreaChartOutlined />}>
                <Link to="/Amlo/Ranking">Customer profiles</Link>
              </Menu.Item>

              <SubMenu
                key="Factor"
                title={
                  <span>
                    <UnorderedListOutlined />
                    <span>Factor</span>
                  </span>
                }
              >
                <SubMenu
                  key="Watchlist"
                  title={
                    <span>
                      <UnorderedListOutlined />
                      <span>Watchlist</span>
                    </span>
                  }
                >
                  <Menu.Item key="watchlist" icon={<SearchOutlined />}>
                    <Link to="/Amlo/Watchlist">Search</Link>
                  </Menu.Item>
                  <Menu.Item key="watchlistupload" icon={<UploadOutlined />}>
                    <Link to="/Amlo/Watchlistupload">Upload</Link>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="area" icon={<GlobalOutlined />}>
                  <Link to="/Amlo/Area">Area</Link>
                </Menu.Item>
                <SubMenu
                  key="Occupation"
                  title={
                    <span>
                      <UnorderedListOutlined />
                      <span>Occupation</span>
                    </span>
                  }
                >
                  <Menu.Item key="occupation" icon={<ContactsOutlined />}>
                    <Link to="/Amlo/Occupation">Set parameter</Link>
                  </Menu.Item>
                  <Menu.Item key="occupationupload" icon={<UploadOutlined />}>
                    <Link to="/Amlo/Occupationupload">Upload</Link>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item
                  key="transactionfactor"
                  icon={<TransactionOutlined />}
                >
                  <Link to="/Amlo/Transactionfactor">Transaction</Link>
                </Menu.Item>
              </SubMenu>

              <Menu.Item key="datecalculaterank" icon={<ScheduleOutlined />}>
                <Link to="/Amlo/Datecalculaterank">Date Calculate Rank</Link>
              </Menu.Item>
              <Menu.Item key="Waitinglist" icon={<PauseOutlined />}>
                <Link to="/Amlo/Waitinglist">Waiting approve</Link>
              </Menu.Item>
              <Menu.Item key="reportcustomeramlo" icon={<FileTextOutlined />}>
                <Link to="/Amlo/Reportcustomeramlo">Report</Link>
              </Menu.Item>
            </SubMenu>
          )}
          <Menu.Item key="rtp-logout" icon={<LogoutOutlined />}>
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout" style={{ backgroundColor: '#fff' }}>
        <Header className="site-layout-background" style={{ padding: 0 }} />

        <Content>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Power by React App v{version} © 2021
        </Footer>
      </Layout>
    </Layout>
  )
}
export default DefaultLayout
