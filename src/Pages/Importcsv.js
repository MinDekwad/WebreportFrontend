import React, { useState } from 'react'
import WalletdailyCSV from './Walletdailycsv'
import ConsumerCSV from './Consumercsv.js'
import MerchantCSV from './Merchantcsv'
import AgentkycCSV from './Agentkyccsv'
import LoanbindingCSV from './Loanbindingcsv'
import UserProfileAmloCSV from './Userprofileamlocsv'

function Importcsv() {
  const [csvType, setCsvType] = useState()

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Import File (CSV)
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header text-left">
                Choose report type and choose your csv file to upload
              </div>
              <div className="card-body">
                <form>
                  <div className="form-group text-left">
                    <div className="input-group-prepend">
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          value="WalletDaily"
                          name="csvtype"
                          onChange={(e) => setCsvType(e.target.value)}
                        />
                        <span className="w5">&nbsp;</span>
                        <label> Wallet Daily</label>
                      </div>
                    </div>
                    <br />
                    <div className="input-group-prepend">
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          value="ConsumerTransaction"
                          name="csvtype"
                          onChange={(e) => setCsvType(e.target.value)}
                        />
                        <span className="w5">&nbsp;</span>
                        <label> Consumer Transaction</label>
                      </div>
                    </div>
                    <br />
                    <div className="input-group-prepend">
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          value="MerchantTransaction"
                          name="csvtype"
                          onChange={(e) => setCsvType(e.target.value)}
                        />
                        <span className="w5">&nbsp;</span>
                        <label> Merchant Transaction </label>
                      </div>
                    </div>
                    <br />
                    <div className="input-group-prepend">
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          value="AgentKyc"
                          name="csvtype"
                          onChange={(e) => setCsvType(e.target.value)}
                        />
                        <span className="w5">&nbsp;</span>
                        <label> Agent KYC</label>
                      </div>
                    </div>
                    <br />
                    <div className="input-group-prepend">
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          value="LoanBinding"
                          name="csvtype"
                          onChange={(e) => setCsvType(e.target.value)}
                        />
                        <span className="w5">&nbsp;</span>
                        <label> Loan Binding</label>
                      </div>
                    </div>
                    <br />
                    {/* <div className="input-group-prepend">
                      <div className="col-sm-12">
                        <input
                          type="radio"
                          value="UserProfileAmlo"
                          name="csvtype"
                          onChange={(e) => setCsvType(e.target.value)}
                        />
                        <span className="w5">&nbsp;</span>
                        <label style={{ color: 'red' }}>
                          {' '}
                          *User Profile (For Amlo)
                        </label>
                      </div>
                    </div>
                    <br /> */}
                    {csvType === 'WalletDaily' ? <WalletdailyCSV /> : ''}
                    {csvType === 'ConsumerTransaction' ? <ConsumerCSV /> : ''}
                    {csvType === 'MerchantTransaction' ? <MerchantCSV /> : ''}
                    {csvType === 'AgentKyc' ? <AgentkycCSV /> : ''}
                    {csvType === 'LoanBinding' ? <LoanbindingCSV /> : ''}
                    {/* {csvType === 'UserProfileAmlo' ? (
                      <UserProfileAmloCSV />
                    ) : (
                      ''
                    )} */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Importcsv
