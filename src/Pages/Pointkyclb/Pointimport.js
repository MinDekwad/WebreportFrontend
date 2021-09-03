import React, { useState } from 'react'
import Kycpendingcsv from './Kycpendingcsv'
import Lbpendingcsv from './Lbpendingcsv'

const Pointimport = () => {
  const [csvType, setCsvType] = useState()

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header text-left">
              Choose type KYC or LB for import
            </div>
            <div className="card-body" style={{ textAlign: 'left' }}>
              <form>
                <div className="input-group-prepend">
                  <div className="col-sm-12">
                    <input
                      type="radio"
                      value="KYC"
                      name="csvtype"
                      onChange={(e) => setCsvType(e.target.value)}
                    />
                    <span className="w5">&nbsp;</span>
                    <label> KYC Pending</label>
                  </div>
                </div>
                <br />
                <div className="input-group-prepend">
                  <div className="col-sm-12">
                    <input
                      type="radio"
                      value="LB"
                      name="csvtype"
                      onChange={(e) => setCsvType(e.target.value)}
                    />
                    <span className="w5">&nbsp;</span>
                    <label> LB Pending</label>
                  </div>
                </div>
                <br />
                {csvType === 'KYC' ? <Kycpendingcsv /> : ''}
                {csvType === 'LB' ? <Lbpendingcsv /> : ''}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Pointimport
