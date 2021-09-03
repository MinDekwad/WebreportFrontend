import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import { useLocation } from "react-router-dom";
import swal from 'sweetalert';

function Editstatementending() {

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');

    const [Uid, setUID] = useState();
    const [balance, setBalanceValue] = useState();
    const [day, setDate] = useState();

    const [bankId, setBankId] = useState('2')
    const changeBankId = (newBankId) =>{
        setBankId(newBankId)
    }

    let sel = "";
    if (bankId === 2){
        sel = "Selected";
    }
    if (bankId === 4){
        sel = "Selected";
    }

    const fetchData = useCallback(async (id) => {
        try{
            const responseEndingBalance = await axios.get(`http://localhost:9000/api/v1/statementendingbalance/getStatementEndingBalanceEdit?id=${id}`)
            const { data : endingbalnace } = responseEndingBalance
            const { data } = endingbalnace
            data.map(data => {
                setBalanceValue(data.Statement_Balance);
                // let dateStr = data.dateTime.substring(0, 10)
                let dateStr = data.Statement_Date.substring(0, 10)
                setDate(dateStr);
                setBankId(data.Bank_UID);
                setUID(data.id);
            })
        }catch(err){
            Error(err)
        }
    },[])

    const fetchDataSave = useCallback(async (DateVal, BankID, StatementEndingBalance,id) => {
        //console.log(id)
        try{
            let dataPost = {
                Statement_Date : DateVal,
                Statement_Balance : StatementEndingBalance,
                Bank_UID : BankID,
                //id : id
            }
            let response = await axios.put(`http://localhost:9000/api/v1/reports/saveEditStatementEndingBalance?id=${id}`,dataPost,)
            let data = response.data;
            let message = data.message
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

        }
    },[])

    useEffect(() => {
    fetchData(id)
    },[])

    const SaveEditStatementEnding = (e) => {
        let id = Uid
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
            fetchDataSave(DateVal, BankID, StatementEndingBalance, id)
        }
    }

    return(
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1 className="m-0">EDIT STATEMENT ENDING BALANCE</h1>
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
                                                        <option value="2" selected={sel}>777-2-38735-5</option>
                                                        <option value="4" selected={sel}>777-2-38736-0</option>
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
                                                    <input onChange={e => setBalanceValue(e.target.value)} type="text" id="StatementEndingBalance" name="StatementEndingBalance" placeholder="Insert balance" autoComplete="off" value={balance} />
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-12">
                                                    <button className="btn btn-success" type="button" onClick={() => {SaveEditStatementEnding()}}>Save</button>
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

export default Editstatementending;