import axios from "axios";
import React, { useCallback, useState } from "react";
import swal from 'sweetalert';
import * as dayjs from 'dayjs'

const today = dayjs().format('YYYY-MM-DD');

function Createstatementending() {

    const [day, setDate] = useState(today);
    const [balanceValue, setBalanceValue] = useState(0);

    const [bankId, setBankId] = useState('2')
    const changeBankId = (newBankId) =>{
        setBankId(newBankId)
    }

    const fetchData = useCallback(async (DateVal, BankID, StatementEndingBalance) => {
        try{
            let dataPost = {
                Statement_Date : DateVal,
                Statement_Balance : StatementEndingBalance,
                Bank_UID : BankID
            }
            let response = await axios.post(`http://localhost:9000/api/v1/reports/createStatementEndingBalance`,dataPost,)
            let data = response.data;
            let message = data.message
            //let message = "error";
            if (message === "success"){
                swal({
                    title: "Done!",
                    text: "Save Success",
                    icon: "success",
                    timer: 2000,
                    button: false
                }) 
                window.setTimeout(function(){ 
                    window.location.reload();
                } ,3000);
            }
            else{
                swal({
                    title: "Error",
                    text: "Cannot save data",
                    icon: "error",
                    timer: 2000,
                    button: false
                }) 
                window.setTimeout(function(){ 
                    window.location.reload();
                } ,3000);
            }
        }catch(err){
            Error(err)
        }
    },[])

    const SaveStatementEnding = (e) => {
        // e.preventDefault();
        // console.log(e.target.txtDate.value)

        let StatementEndingBalance = document.querySelector('#StatementEndingBalance').value;
        if (StatementEndingBalance === ""){
            swal({
                title: "Error",
                text: "Please insert balance",
                icon: "error",
                button: true
            }) 
        }else{
            let DateVal = document.querySelector('#txtDate').value;
            DateVal = DateVal+'T00:00:00Z'
            let BankID = document.querySelector('#BankDetailId').value;
            BankID = JSON.parse(BankID)
            StatementEndingBalance = JSON.parse(StatementEndingBalance)
            fetchData(DateVal, BankID, StatementEndingBalance)
        }
    }

    return(
        <div className="content-wrapper">
           <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1 className="m-0">CREATE STATEMENT ENDING BALANCE</h1>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <div className="input-group-prepend">
                                                <div className="col-sm-3">
                                                    <label>Date : </label>
                                                    <span className="w5"></span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <input onChange={e => setDate(e.target.value)} type="date" id="txtDate" name="txtDate" value={day} />
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-3">
                                                    <label>Bank Account</label>
                                                    <span className="w5"></span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <select id="BankDetailId" name="BankDetailId" onChange={(e) => changeBankId(e.target.value)} value={bankId} >
                                                        <option value="2">777-2-38735-5</option>
                                                        <option value="4">777-2-38736-0</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-3">
                                                    <label>Statement Ending Balance</label>
                                                    <span className="w5"></span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <input onChange={e => setBalanceValue(e.target.value)} type="text" id="StatementEndingBalance" name="StatementEndingBalance" placeholder="Insert balance" autoComplete="off" value={balanceValue} />
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-12">
                                                    <button className="btn btn-success" type="button" onClick={() => {SaveStatementEnding()}}>Save</button>
                                                </div>
                                            </div>
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
export default Createstatementending;