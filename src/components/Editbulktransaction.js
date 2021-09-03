import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import { useLocation } from "react-router-dom";
import swal from 'sweetalert';

function Editbulktransaction () {

    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');

    const [Uid, setUID] = useState();
    const [bulkCredit, setBulkCredit] = useState();
    const [bulkCreditFee, setBulkCreditFee] = useState();
    const [transfer, setTransfer] = useState(0);
    const [day, setDate] = useState();

    const fetchData = useCallback(async (id) => {
        try{
            const responseBulkTransaction = await axios.get(`http://localhost:9000/api/v1/bulktransaction/getBulktransactionEdit?id=${id}`)
            const { data : bulktransaction } = responseBulkTransaction
            const { data } = bulktransaction
            data.map(data => {
                setBulkCredit(data.bulkCreditSameday);
                setBulkCreditFee(data.bulkCreditSamedayFee);
                setTransfer(data.transfertobankaccount);
                let dateStr = data.dateTime.substring(0, 10)
                setDate(dateStr);
                setUID(data.id);
            })
        }catch(err){
            Error(err)
        }
    },[])

    const fetchDataSave = useCallback(async (DateVal, BulkCreditSameday, BulkCreditSamedayfee, TransferToBankAccount,id) => {
        try{
            let dataPost = {
                date_time : DateVal,
                bulk_credit_sameday : BulkCreditSameday,
                bulk_credit_sameday_fee : BulkCreditSamedayfee,
                transfertobankaccount : TransferToBankAccount
            }
            let response = await axios.put(`http://localhost:9000/api/v1/reports/saveEditBulkTransaction?id=${id}`,dataPost,)
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

    const SaveData = (e) => {
        let id = Uid
        let BulkCreditSameday = document.querySelector("#BulkCreditSameday").value;
        let BulkCreditSamedayfee = document.querySelector("#BulkCreditSamedayfee").value;
        let TransferToBankAccount = document.querySelector("#TransferToBankAccount").value;
        let error = 0;
        if(BulkCreditSameday === ""){
            error = 1
            swal({
                title: "Error",
                text: "Please insert data on Bulk Credit Sameday",
                icon: "error",
                button: true
            }) 
        }
        if(BulkCreditSamedayfee === ""){
            error = 1
            swal({
                title: "Error",
                text: "Please insert data on Bulk Credit Sameday fee",
                icon: "error",
                button: true
            }) 
        }
        if(TransferToBankAccount === ""){
            error = 1
            swal({
                title: "Error",
                text: "Please insert data Transfer To Bank Account",
                icon: "error",
                button: true
            }) 
        }
        
        if(error === 1){
            swal({
                title: "Error",
                text: "Please insert data to complete",
                icon: "error",
                button: true
            })
        }else{
            let DateVal = document.querySelector('#txtDate').value;
            DateVal = DateVal+'T00:00:00Z';
            BulkCreditSameday = JSON.parse(BulkCreditSameday);
            BulkCreditSamedayfee = JSON.parse(BulkCreditSamedayfee);
            TransferToBankAccount = JSON.parse(TransferToBankAccount);
            fetchDataSave(DateVal, BulkCreditSameday, BulkCreditSamedayfee, TransferToBankAccount, id);
        }
    }
    
    return(
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1 className="m-0">EDIT BULK TRANSACTION</h1>
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
                                                    <label>Bulk credit sameday</label>
                                                    <span className="w5"></span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <input onChange={e => setBulkCredit(e.target.value)}  type="text" id="BulkCreditSameday" name="BulkCreditSameday" placeholder="Insert balance" autoComplete="off" value={bulkCredit} />
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-3">
                                                    <label>Bulk credit sameday fee</label>
                                                    <span className="w5"></span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <input onChange={e => setBulkCreditFee(e.target.value)}  type="text" id="BulkCreditSamedayfee" name="BulkCreditSamedayfee" placeholder="Insert balance" autoComplete="off" value={bulkCreditFee} />
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-3">
                                                    <label>Transfer to bank account</label>
                                                    <span className="w5"></span>
                                                </div>
                                                <div className="col-sm-9">
                                                    <input onChange={e => setTransfer(e.target.value)}  type="text" id="TransferToBankAccount" name="TransferToBankAccount" placeholder="Insert balance" autoComplete="off" value={transfer} />
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="input-group-prepend">
                                                <div className="col-sm-12">
                                                    <button className="btn btn-success" type="button" onClick={() => {SaveData()}}  >Save</button>
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

export default Editbulktransaction;