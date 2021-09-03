import React, { useState } from 'react';
import WalletdailyCSV from './WalletdailyCSV';
import ConsumerCSV from './ConsumerCSV';
import MerchantCSV from './MerchantCSV';
import AgentKycCSV from './AgentKycCSV';
import LoanBindingCSV from './LoanBindingCSV';

function  Importwallet() {
    const [csvType, setCsvType] = useState();
    console.log(csvType);
    // let checkWalletDaily
    // if(csvType === "WalletDaily") {
    //     checkWalletDaily = "true";
    // }
    // else{
    //     checkWalletDaily = "false";
    // }
    return(
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1 className="m-0">Import file (CSV)</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">Choose report type and choose your csv file to upload</div>
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <div className="input-group-prepend">
                                                <div className="col-sm-12">
                                                    <input type="radio" value="WalletDaily" name="csvtype" onChange={e => setCsvType(e.target.value)}/>
                                                    <span className="w5">&nbsp;</span>
                                                    <label> Wallet Daily</label>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-12">
                                                    <input type="radio" value="ConsumerTransaction" name="csvtype" onChange={e => setCsvType(e.target.value)} />
                                                    <span className="w5">&nbsp;</span>
                                                    <label> Consumer Transaction</label>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">                                                
                                                <div className="col-sm-12">
                                                    <input type="radio" value="MerchantTransaction" name="csvtype" onChange={e => setCsvType(e.target.value)} />
                                                    <span className="w5">&nbsp;</span>
                                                    <label> Merchant Transaction </label>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-12">
                                                    <input type="radio" value="AgentKyc" name="csvtype" onChange={e => setCsvType(e.target.value)} />
                                                    <span className="w5">&nbsp;</span>
                                                    <label> Agent KYC</label>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-12">
                                                    <input type="radio" value="LoanBinding" name="csvtype" onChange={e => setCsvType(e.target.value)} />
                                                    <span className="w5">&nbsp;</span>
                                                    <label> Loan Binding</label>
                                                </div>
                                            </div>
                                            <br/>
                                            { csvType === "WalletDaily" ? <WalletdailyCSV /> : "" }
                                            { csvType === "ConsumerTransaction" ? <ConsumerCSV /> : "" }
                                            { csvType === "MerchantTransaction" ? <MerchantCSV /> : "" }
                                            { csvType === "AgentKyc" ? <AgentKycCSV /> : "" }
                                            { csvType === "LoanBinding" ? <LoanBindingCSV /> : "" }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Importwallet;