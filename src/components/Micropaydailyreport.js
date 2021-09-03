import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
//import { jsPDF } from "jspdf";
//import Calendar from 'react-calendar'
//import DayPickerInput from 'react-day-picker/DayPickerInput'

import 'react-calendar/dist/Calendar.css'
import "jspdf-autotable";
import 'react-day-picker/lib/style.css'
import * as dayjs from 'dayjs'

//const today = dayjs().format('YYYY-MM-DD');
// const today = dayjs().subtract(1, 'days').format('YYYY-MM-DD')

const today = dayjs().subtract(1, 'days').format('YYYY-MM-DD')

// function LoadPDF() {
//   const doc = new jsPDF("p", "px", "A4");
//   doc.html(document.getElementById('MainPDF'), {
//     callback: function (doc) {
//       doc.save('summary_report.pdf');
//     },
//     x: 20,
//     y: 20
//   });
// }

function Micropaydailyreport() {

  const PrintOrder = (day) => {
    const printableElements = document.getElementById('MainPDF').innerHTML;
    const orderHtml = '<html><head><title></title></head><body>' + printableElements + '</body></html>'
    const oldPage = document.body.innerHTML;
    document.body.innerHTML = orderHtml;
    window.print();
    document.body.innerHTML = oldPage;
    window.location.reload(false);
  }

  const [day,setDate] = useState(today);
  const [dayStr, setDayStr] = useState(today);

  const [intro, setIntro] = useState({
    new_wallet: 0,
    no_of_wallet: 0,
    wallet_balance: 0,
    diff_wallet_balance: 0,
    total_balance_in_micro_pay: 0,
    statement_ending_balance: 0,
    statement_incoming_balance: 0,
  })

  const [tranIn, setTranIn] = useState({
    wallet_to_wallet : { count_wallet_to_wallet : 0, sum_wallet_to_wallet : 0 },
    settle_merchant_online : { count_settle_merchant_online : 0,  sum_settle_merchant_online : 0 },
    adjust_to_wallet : { count_adjust_to_wallet : 0, sum_adjust_to_wallet : 0 }, 
    promptpay_in_other_bank_tran_in : { count_prompt_pay_in_other_bank_tran_in : 0, sum_prompt_pay_in_other_bank_tran_in : 0 },
    promptpay_in_tcrb_tran_in : {count_prompt_pay_in_tcrb_tran_in :0, sum_prompt_pay_in_tcrb_tran_in : 0},
    promptpay_in_tag_thirty_tran_in : {count_promptpay_in_tag_thirty_tran_in : 0, sum_promptpay_in_tag_thirty_tran_in : 0},
    topup_loan_disbursement_tran_in : {count_topup_loan_disbursement_tran_in : 0, sum_topup_loan_disbursement_tran_in : 0},
    topup_loan_direct_debit_tran_in : {count_topup_direct_debit_tran_in : 0, sum_topup_direct_debit_tran_in : 0},
    topup_pay_roll_tran_in : {count_topup_pay_roll_tran_in : 0, sum_topup_pay_roll_tran_in : 0},
    online_loan_topup_tran_in : {count_online_loan_topup_tran_in : 0, sum_online_loan_topup_tran_in : 0},
  })

  const [collectoral, setCollectoral] = useState({
    collectoral_in: { count_collectoral_in : 0, sum_collectoral_in : 0},
    collectoral_out: { count_collectoral_out : 0, sum_collectoral_out : 0},
    collectoral_balance : 0,
  })

  const [tranOut ,setTranOut] = useState({
    adjust_from_wallet: { count_adjust_from_wallet_tran_out : 0, sum_adjust_from_wallet_tran_out : 0 },
    prompt_pay_out_other_bank_tran_out: { count_prompt_pay_out_other_bank_tran_out : 0, sum_prompt_pay_out_other_bank_tran_out : 0 },
    prompt_pay_out_tcrb_tran_out: {count_prompt_pay_out_tcrb_tran_out : 0, sum_prompt_pay_out_tcrb_tran_out : 0},
    prompt_pay_out_tag_thirty_tran_out: {count_promptpay_out_tag_thirty_tran_out : 0, sum_promptpay_out_tag_thirty_tran_out : 0},
    tcrb_bill_payment_tran_out: {count_tcrb_bill_payment_tran_out : 0, sum_tcrb_bill_payment_tran_out : 0},
    transfer_to_bank_account_txn_tran_out: {count_transfer_to_bank_account_txn_tran_out : 0, sum_transfer_to_bank_account_txn_tran_out : 0},
    transfer_to_bank_account_fee_tran_out: {count_transfer_to_bank_account_fee_tran_out : 0, sum_transfer_to_bank_account_fee_tran_out : 0},
    online_bill_payment_tran_out: {count_online_bill_payment_tran_out : 0, sum_online_bill_payment_tran_out : 0},
  })

  const [suspend, setSuspend] = useState({
    promptpay_in_other_bank_suspend: { count_promptpay_in_other_bank_suspend : 0, sum_promptpay_in_other_bank_suspend : 0},
    promptpay_out_other_bank_suspend: { count_promptpay_out_other_bank_suspend : 0, sum_promptpay_out_other_bank_suspend : 0},
    promptpay_out_tcrb_suspend : { count_promptpay_out_tcrb_suspend : 0, sum_promptpay_out_tcrb_suspend : 0},
    tcrb_bill_payment_suspend : { count_tcrb_bill_payment_suspend : 0, sum_tcrb_bill_payment_suspend : 0},
  })

  const [settleCollectoral , setSettleCollectoral] = useState({
    tcrb_bill_payment_settle_collectoral : 0,
    online_bill_payment_settle_collectoral : 0,
    prompt_pay_out_settle_collectoral : 0,
  })

  const [settleTransaction, setSettleTransaction] = useState({
    tcrb_bill_payment_settlement_transaction: { count_tcrb_bill_payment_settlement_transaction : 0, sum_tcrb_bill_payment_settlement_transaction : 0},
    online_bill_payment_settlement_transaction : { count_online_bill_payment_settlement_transaction : 0, sum_online_bill_payment_settlement_transaction : 0},
    prompt_pay_out_settlement_transaction : { count_prompt_pay_out_settlement_transaction : 0, sum_prompt_pay_out_settlement_transaction : 0},
    bulk_credit_sameday_settlement_transaction : {transfer_to_bank_account : 0 , bulk_credit_sameday : 0}, 
    bulk_credit_sameday_fee_settlement_transaction : { transfer_to_bank_account_fee : 0, bulk_credit_sameday_fee : 0},
    topup_loan_disbursement_settlement_transaction : { count_topup_loan_disbursement_settlement_transaction : 0, sum_topup_loan_disbursement_settlement_transaction : 0 },
    online_loan_topup_settlement_transaction : { count_online_loan_topup_settlement_transaction : 0, sum_online_loan_topup_settlement_transaction : 0},
    prompt_pay_in_other_bank_settlement_transaction : { count_prompt_pay_in_other_bank_settlement_transaction : 0, sum_prompt_pay_in_other_bank_settlement_transaction : 0},
  })

  const [income , setIncome] = useState({
    transfer_to_bank_account_income : { count_transfer_to_bank_account_income : 0, sum_transfer_to_bank_account_income : 0},
    new_binding_revolving : { count_new_binding_revolving_income : 0, sum_new_binding_revolving_income : 0},
    online_loan_topup_income : { count_online_loan_topup_income : 0, sum_online_loan_topup_income : 0 },
    online_bill_payment_income : { count_online_bill_payment_income : 0, sum_online_bill_payment_income : 0 },
  })

  const [expenses, setExpenses] = useState({
    kyc_complete_fee_expenses : { count_kyc_complete_fee_expenses : 0, sum_kyc_complete_fee_expenses : 0},
    prompt_pay_out_expenses : { count_prompt_pay_out_expenses : 0, sum_prompt_pay_out_expenses : 0},
    bulk_transfer_fee_expense : { 
      count_transfertobankaccount : 0 , 
      // sum_count_transfertobankaccount : 0
    },
    tmds_kyc_case_expense : { count_tmds_kyc_case_expense : 0, sum_tmds_kyc_case_expense : 0},
    promptpay_out_icfee_expense : { count_promptpay_out_ic_fee_expense : 0, sum_promptpay_out_ic_fee_expense : 0},
    promptpay_in_icfee_expense : { count_promptpay_in_ic_fee_expense : 0, sum_promptpay_in_ic_fee_expense : 0},
    promptpay_out_tag_thirty_expense : { count_promptpay_out_tag_thirty_expense : 0, sum_promptpay_out_tag_thirty_expense : 0},
  })

  // const handelSubmit = (e) =>{
  //   e.preventDefault();
  //   //alert(e.target.txtDate.value);
  // }

  const fetchDataIntro = useCallback(async (day) => {
  
    try {
      const responseIntro = await axios.get(
        `http://localhost:9000/api/v1/reports/introduction?date=${day}`,
      )
      const { data: newwallet } = responseIntro
      //const { message, data } = newwallet
      const { data } = newwallet
      //console.log(data);
      setIntro(data)
    } catch (err) {
      Error(err)
    }
  }, [])

  const fetchDataTranIn = useCallback(async (day) => {
    try{
      const responseTransactionIn = await axios.get(
        `http://localhost:9000/api/v1/reports/transactionIn?date=${day}`,
      )
      const { data: tranin } = responseTransactionIn
      //const { message, data } = tranin
      const { data } = tranin
      setTranIn(data);
    }catch (err) {
      Error(err)
    }
  }, [])

  const fetchDataCollectoral = useCallback(async (day) => {
    try{
      const responseCollectoral = await axios.get(
        `http://localhost:9000/api/v1/reports/collectoral?date=${day}`,
      )
      const { data: collectoral } = responseCollectoral
      //const { message, data } = collectoral
      const { data } = collectoral
      setCollectoral(data);
    }catch (err) {
      Error(err)
    }
  }, [])

  const fecthDataTranOut = useCallback(async (day) => {
    try{
      const responseTransactionOut = await axios.get(
        `http://localhost:9000/api/v1/reports/transactionOut?date=${day}`,
      )
      const { data: tranout } = responseTransactionOut
      // const { message, data } = tranout
      const { data } = tranout
      setTranOut(data);
    }catch (err) {
      Error(err)
    }
  }, [])

  const fetchDataSuspend = useCallback(async (day) => {
    try{
      const responseSuspend = await axios.get (
        `http://localhost:9000/api/v1/reports/suspendAfterCutOffTime?date=${day}`,
      )
      const { data : suspend } = responseSuspend
      //const { message, data } = suspend
      const { data } = suspend
      setSuspend(data)
    }catch(err){
      Error(err)
    }
  }, [])

  const fetchDataSettleCollectoral = useCallback(async (day) => {
    try{
      const responsSettleCollectoral = await axios.get(`http://localhost:9000/api/v1/reports/settlementCollectoral?date=${day}`)
      const {data : settlecollectoral} = responsSettleCollectoral
      //const { message , data } = settlecollectoral
      const { data } = settlecollectoral
      setSettleCollectoral(data)
    }catch(err){
      Error(err)
    }
  }, [])

  const fetchDataSettleTransaction = useCallback(async (day) => {
    try{
      const responsSettleTransaction = await axios.get(`http://localhost:9000/api/v1/reports/settlementTransaction?date=${day}`)
      const {data : settletransaction} = responsSettleTransaction
      //const { message , data } = settletransaction
      const { data } = settletransaction
      setSettleTransaction(data)
    }catch(err){
      Error(err)
    }
  }, [])

  const fetchDataIncome = useCallback(async (day) => {
    try{
      const responseIncome = await axios.get(`http://localhost:9000/api/v1/reports/income?date=${day}`)
      const { data : income } = responseIncome
      //const { message, data } = income
      const { data } = income
      setIncome(data)
    }catch(err){
      Error(err)
    }
  }, [])

  const fetchDataExpense = useCallback(async (day) => {
    try{
      const responseExpense = await axios.get(`http://localhost:9000/api/v1/reports/expenses?date=${day}`)
      const { data : expenses } = responseExpense
      //const { message, data} = expenses
      const { data} = expenses
      setExpenses(data)
    }catch(err){
      Error(err)
    }
  }, [])

  useEffect(() => {
    fetchDataIntro(day)
    fetchDataTranIn(day)
    fetchDataCollectoral(day)
    fecthDataTranOut(day)
    fetchDataSuspend(day)
    fetchDataSettleCollectoral(day)
    fetchDataSettleTransaction(day)
    fetchDataIncome(day)
    fetchDataExpense(day)
  }, [fetchDataIntro], [fetchDataTranIn], [fetchDataCollectoral], [fecthDataTranOut], [fetchDataSuspend], [fetchDataSettleCollectoral], [fetchDataSettleTransaction], [fetchDataIncome], [fetchDataExpense])

  const {
    new_wallet,
    no_of_wallet,
    wallet_balance,
    diff_wallet_balance,
    total_balance_in_micro_pay,
    statement_ending_balance,
    statement_incoming_balance,
  } = intro

  const {
    wallet_to_wallet : { count_wallet_to_wallet, sum_wallet_to_wallet },
    settle_merchant_online : { count_settle_merchant_online,  sum_settle_merchant_online },
    adjust_to_wallet : { count_adjust_to_wallet, sum_adjust_to_wallet }, 
    promptpay_in_other_bank_tran_in : { count_prompt_pay_in_other_bank_tran_in, sum_prompt_pay_in_other_bank_tran_in },
    promptpay_in_tcrb_tran_in : {count_prompt_pay_in_tcrb_tran_in, sum_prompt_pay_in_tcrb_tran_in },
    promptpay_in_tag_thirty_tran_in : {count_promptpay_in_tag_thirty_tran_in, sum_promptpay_in_tag_thirty_tran_in},
    topup_loan_disbursement_tran_in : {count_topup_loan_disbursement_tran_in, sum_topup_loan_disbursement_tran_in},
    topup_loan_direct_debit_tran_in : {count_topup_direct_debit_tran_in, sum_topup_direct_debit_tran_in},
    topup_pay_roll_tran_in : {count_topup_pay_roll_tran_in, sum_topup_pay_roll_tran_in},
    online_loan_topup_tran_in : {count_online_loan_topup_tran_in, sum_online_loan_topup_tran_in},
  } = tranIn

  const {
    collectoral_in: { count_collectoral_in, sum_collectoral_in},
    collectoral_out: { count_collectoral_out, sum_collectoral_out},
    collectoral_balance,
  } = collectoral

  const {
    adjust_from_wallet: { count_adjust_from_wallet_tran_out, sum_adjust_from_wallet_tran_out },
    prompt_pay_out_other_bank_tran_out: { count_prompt_pay_out_other_bank_tran_out, sum_prompt_pay_out_other_bank_tran_out },
    prompt_pay_out_tcrb_tran_out: {count_prompt_pay_out_tcrb_tran_out, sum_prompt_pay_out_tcrb_tran_out},
    prompt_pay_out_tag_thirty_tran_out: {count_promptpay_out_tag_thirty_tran_out, sum_promptpay_out_tag_thirty_tran_out},
    tcrb_bill_payment_tran_out: {count_tcrb_bill_payment_tran_out, sum_tcrb_bill_payment_tran_out},
    transfer_to_bank_account_txn_tran_out: {count_transfer_to_bank_account_txn_tran_out, sum_transfer_to_bank_account_txn_tran_out},
    transfer_to_bank_account_fee_tran_out: {count_transfer_to_bank_account_fee_tran_out, sum_transfer_to_bank_account_fee_tran_out},
    online_bill_payment_tran_out: {count_online_bill_payment_tran_out, sum_online_bill_payment_tran_out},
  } = tranOut

  const {
    promptpay_in_other_bank_suspend: { count_promptpay_in_other_bank_suspend, sum_promptpay_in_other_bank_suspend},
    promptpay_out_other_bank_suspend: { count_promptpay_out_other_bank_suspend, sum_promptpay_out_other_bank_suspend},
    promptpay_out_tcrb_suspend : { count_promptpay_out_tcrb_suspend, sum_promptpay_out_tcrb_suspend},
    tcrb_bill_payment_suspend : { count_tcrb_bill_payment_suspend, sum_tcrb_bill_payment_suspend},
  } = suspend

  const {
    tcrb_bill_payment_settle_collectoral,
    online_bill_payment_settle_collectoral,
    prompt_pay_out_settle_collectoral,
  } = settleCollectoral

  const {
    tcrb_bill_payment_settlement_transaction: { count_tcrb_bill_payment_settlement_transaction, sum_tcrb_bill_payment_settlement_transaction},
    online_bill_payment_settlement_transaction : { count_online_bill_payment_settlement_transaction, sum_online_bill_payment_settlement_transaction},
    prompt_pay_out_settlement_transaction : { count_prompt_pay_out_settlement_transaction, sum_prompt_pay_out_settlement_transaction},
    bulk_credit_sameday_settlement_transaction : { transfer_to_bank_account , bulk_credit_sameday},
    bulk_credit_sameday_fee_settlement_transaction : { transfer_to_bank_account_fee, bulk_credit_sameday_fee},
    topup_loan_disbursement_settlement_transaction : { count_topup_loan_disbursement_settlement_transaction, sum_topup_loan_disbursement_settlement_transaction},
    online_loan_topup_settlement_transaction : { count_online_loan_topup_settlement_transaction, sum_online_loan_topup_settlement_transaction},
    prompt_pay_in_other_bank_settlement_transaction : { count_prompt_pay_in_other_bank_settlement_transaction, sum_prompt_pay_in_other_bank_settlement_transaction},
  } = settleTransaction

  const {
    transfer_to_bank_account_income : { count_transfer_to_bank_account_income , sum_transfer_to_bank_account_income},
    new_binding_revolving : { count_new_binding_revolving_income, sum_new_binding_revolving_income},
    online_loan_topup_income : { count_online_loan_topup_income, sum_online_loan_topup_income},
    online_bill_payment_income : { count_online_bill_payment_income, sum_online_bill_payment_income},
  } = income

  const {
    kyc_complete_fee_expenses : { count_kyc_complete_fee_expenses, sum_kyc_complete_fee_expenses},
    prompt_pay_out_expenses : { count_prompt_pay_out_expenses, sum_prompt_pay_out_expenses},
    bulk_transfer_fee_expense : { 
      count_transfertobankaccount 
      // sum_count_transfertobankaccount
    },
    tmds_kyc_case_expense : { count_tmds_kyc_case_expense, sum_tmds_kyc_case_expense},
    promptpay_out_icfee_expense : { count_promptpay_out_ic_fee_expense, sum_promptpay_out_ic_fee_expense},
    promptpay_in_icfee_expense : { count_promptpay_in_ic_fee_expense, sum_promptpay_in_ic_fee_expense},
    promptpay_out_tag_thirty_expense : { count_promptpay_out_tag_thirty_expense, sum_promptpay_out_tag_thirty_expense},
  } = expenses

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-12">
              <h1 className="m-0">MICRO PAY DAILY SUMMARY REPORT</h1>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header"> Report of date : {day}</div>
                <div className="card-body">
                  <div className="form-group">
                    <div className="col-sm-4 fl">
                      {/* <form onSubmit={handelSubmit}> */}
                      <form>
                        <div className="form-group">
                          <div className="input-group-prepend">
                            <input onChange={e => setDate(e.target.value)} type="date" id="txtDate" name="txtDate" value={day} />
                            {/* <span className="input-group-text spanDateDailySummaryReport">
                              <i className="far fa-calendar-alt"></i>
                            </span> */}
                            <span className="w5"></span>
                            {/* <button className="btn btn-success">Search</button> */}
                            <button className="btn btn-success" type="button" onClick={() => { fetchDataIntro(day);fetchDataTranIn(day);fetchDataCollectoral(day);fecthDataTranOut(day);fetchDataSuspend(day);fetchDataSettleCollectoral(day);fetchDataSettleTransaction(day);fetchDataIncome(day);fetchDataExpense(day);setDayStr(day);}}>Search</button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <br />
                    <br />
                    <div className="col-12" id="MainPDF">
                      <table className="table table-bordered table-hover" style={{width: '100%',margin: 'auto',background: 'royalblue',}}>
                        <thead>
                          <tr>
                            <td align="left" className="title-micropay">
                              Micro Pay Daily Summary Report
                            </td>
                            <td align="right">
                              <img src="dist/img/LogoTMD.png" alt="" />
                            </td>
                          </tr>
                        </thead>
                      </table>
                      <table style={{width: '100%',margin: 'auto',border: '1px solid',}}>
                        <tbody>
                          <tr>
                            <td style={{ width: '50%', border: '1px solid' }}>
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td>
                                      Report Date :
                                      <span style={{paddingLeft:'5px'}}>{dayStr}</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>New Wallet </td>
                                    <td align="right"style={{ paddingRight: '10px' }}>
                                      {new_wallet.toLocaleString('en')}
                                    </td>
                                    <td align="left"style={{ paddingLeft: '10px' }}>
                                      Wallet
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>No of Wallet</td>
                                    <td align="right"style={{ paddingRight: '10px' }}>
                                      {no_of_wallet.toLocaleString('en')}
                                    </td>
                                    <td  align="left"style={{ paddingLeft: '10px' }}>
                                      Wallet
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Wallet Balance</td>
                                    <td align="right"style={{ paddingRight: '10px' }}>
                                      {wallet_balance.toLocaleString('en')}
                                    </td>
                                    <td align="left"style={{ paddingLeft: '10px' }}>
                                      Thb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Diff. Balance (from previous day)</td>
                                    <td align="right"style={{ paddingRight: '10px' }}>
                                      {diff_wallet_balance.toLocaleString('en')}
                                    </td>
                                    <td align="left" style={{ paddingLeft: '10px' }}>
                                      Thb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Net Float (Transaction)</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {((sum_adjust_to_wallet + sum_prompt_pay_in_other_bank_tran_in + sum_prompt_pay_in_tcrb_tran_in + sum_promptpay_in_tag_thirty_tran_in + sum_topup_loan_disbursement_tran_in + sum_topup_direct_debit_tran_in + sum_topup_pay_roll_tran_in + sum_online_loan_topup_tran_in)-(sum_adjust_from_wallet_tran_out + sum_prompt_pay_out_other_bank_tran_out + sum_prompt_pay_out_tcrb_tran_out + sum_promptpay_out_tag_thirty_tran_out + sum_tcrb_bill_payment_tran_out + sum_transfer_to_bank_account_txn_tran_out + sum_transfer_to_bank_account_fee_tran_out + sum_online_bill_payment_tran_out)).toLocaleString('en')}
                                    </td>
                                    <td align="left" style={{ paddingLeft: '10px' }}>
                                      Thb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Diff. Balance vs Transaction</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {((diff_wallet_balance) - ((sum_adjust_to_wallet + sum_prompt_pay_in_other_bank_tran_in + sum_prompt_pay_in_tcrb_tran_in + sum_promptpay_in_tag_thirty_tran_in + sum_topup_loan_disbursement_tran_in + sum_topup_direct_debit_tran_in + sum_topup_pay_roll_tran_in + sum_online_loan_topup_tran_in)-(sum_adjust_from_wallet_tran_out + sum_prompt_pay_out_other_bank_tran_out + sum_prompt_pay_out_tcrb_tran_out + sum_promptpay_out_tag_thirty_tran_out + sum_tcrb_bill_payment_tran_out + sum_transfer_to_bank_account_txn_tran_out + sum_transfer_to_bank_account_fee_tran_out + sum_online_bill_payment_tran_out))).toLocaleString('en')}
                                    </td>
                                    <td align="left" style={{ paddingLeft: '10px' }} >
                                      Thb
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <td>|</td>
                                    <td align="right"></td>
                                    <td align="left"></td>
                                  </tr> */}
                                  <tr style={{ backgroundColor: 'dimgray', color: 'white' }} >
                                    <td>Transaction In</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Wallet to Wallet</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      { count_wallet_to_wallet === undefined ? 0: count_wallet_to_wallet }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      { sum_wallet_to_wallet === undefined? 0: sum_wallet_to_wallet.toLocaleString('en') }
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Settle Merchant Online</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      { count_settle_merchant_online === undefined ? 0: count_settle_merchant_online }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      { sum_settle_merchant_online === undefined? 0: sum_settle_merchant_online.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                    <td align="right">&nbsp;</td>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                    <td align="right">&nbsp;</td>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'dimgray', color: 'white' }} >
                                    <td>Transaction In</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Adjust to Wallet</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      { count_adjust_to_wallet }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      { sum_adjust_to_wallet.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt Pay In Other Bank</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_prompt_pay_in_other_bank_tran_in}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_prompt_pay_in_other_bank_tran_in.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt Pay In TCRB</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_prompt_pay_in_tcrb_tran_in}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_prompt_pay_in_tcrb_tran_in.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt Pay In Tag30</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_promptpay_in_tag_thirty_tran_in}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_promptpay_in_tag_thirty_tran_in.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Top up Loan disbursement</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_topup_loan_disbursement_tran_in}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_topup_loan_disbursement_tran_in.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Top up Direct Debit</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      { count_topup_direct_debit_tran_in }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      { sum_topup_direct_debit_tran_in.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Topup Pay roll</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      { count_topup_pay_roll_tran_in }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      { sum_topup_pay_roll_tran_in.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Online Loan Top Up</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_online_loan_topup_tran_in}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_online_loan_topup_tran_in.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr style={{backgroundColor: 'grey',fontWeight: 'bold'}} >
                                    <td>Total</td>
                                    <td align="right"  style={{ paddingRight: '10px' }}>&nbsp;</td>
                                    <td align="right"  style={{ paddingLeft: '10px' }}>
                                      {(sum_adjust_to_wallet + sum_prompt_pay_in_other_bank_tran_in + sum_prompt_pay_in_tcrb_tran_in + sum_promptpay_in_tag_thirty_tran_in + sum_topup_loan_disbursement_tran_in + sum_topup_direct_debit_tran_in + sum_topup_pay_roll_tran_in + sum_online_loan_topup_tran_in).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'dimgray', color: 'white' }} >
                                    <td>Settlement Collectoral</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      Settlement time
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>TCRB Bill Payment</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      21:00:00
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      { tcrb_bill_payment_settle_collectoral.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Online Bill Payment</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      23:00:00
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      { online_bill_payment_settle_collectoral.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay out</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      23:00:00
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      { prompt_pay_out_settle_collectoral.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr style={{ backgroundColor: 'grey',fontWeight: 'bold'}}>
                                    <td>Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(tcrb_bill_payment_settle_collectoral + online_bill_payment_settle_collectoral + prompt_pay_out_settle_collectoral).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'dimgray', color: 'white' }} >
                                    <td>Income</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      No. of TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      Total
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Tranfer to bank account (20thb)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_transfer_to_bank_account_income}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_transfer_to_bank_account_income.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>New binding - Revolving</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_new_binding_revolving_income}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_new_binding_revolving_income.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Online loan top up (5thb)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_online_loan_topup_income}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_online_loan_topup_income.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Online bill payment (5thb)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_online_bill_payment_income}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_online_bill_payment_income.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr style={{ backgroundColor: 'grey',fontWeight: 'bold'}}>
                                    <td>Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(sum_transfer_to_bank_account_income + sum_new_binding_revolving_income + sum_online_loan_topup_income + sum_online_bill_payment_income).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Adjustment Memo</td>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                </tbody>
                              </table>
                            </td>
                            <td style={{ width: '50%', border: '1px solid' }}>
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td colSpan={3}>
                                      <table border="1" style={{ width: '100%' }} >
                                        <tbody>
                                          <tr>
                                            <td align="left">Report by</td>
                                            <td align="left">Checker by</td>
                                          </tr>
                                          <tr>
                                            <td
                                              align="left"
                                              style={{ height: '74px' }}
                                            ></td>
                                            <td align="left"></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <td width="50%">&nbsp;</td>
                                    <td width="30%" align="right">
                                      &nbsp;
                                    </td>
                                    <td width="20%" align="right">
                                      &nbsp;
                                    </td>
                                  </tr> */}
                                  
                                  <tr>
                                    <td colSpan={2}>
                                      Total Balance in Micro Pay system
                                    </td>
                                    <td align="right">
                                      {total_balance_in_micro_pay.toLocaleString('en')}
                                      <span style={{ paddingLeft: '10px' }}>
                                        Thb
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}>
                                      Statement Ending Balance (Float)
                                    </td>
                                    <td align="right">
                                      {statement_ending_balance.toLocaleString('en')}
                                      <span style={{ paddingLeft: '10px' }}>
                                        Thb
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2}>
                                      Statement Incoming Balance (Direct Debit))
                                    </td>
                                    <td align="right">
                                      {statement_incoming_balance.toLocaleString('en')}
                                      <span style={{ paddingLeft: '10px' }}>
                                        Thb
                                      </span>
                                    </td>
                                  </tr>
                                  <tr style={{backgroundColor: 'dimgray',color: 'white'}}>
                                    <td>Collectoral</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Collectoral In</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_collectoral_in}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_collectoral_in.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Collectoral Out</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_collectoral_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_collectoral_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'grey',fontWeight: 'bold'}}>
                                    <td>Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(sum_collectoral_in - sum_collectoral_out).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Collectoral Balance</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      &nbsp;
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {/* {collectoral_balance.toLocaleString('en')} */}
                                    </td>
                                  </tr>
                                  <tr style={{backgroundColor: 'dimgray', color: 'white'}}>
                                    <td>Transaction Out</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Adjust from Wallet</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_adjust_from_wallet_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_adjust_from_wallet_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt Pay Out Other Bank</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_prompt_pay_out_other_bank_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_prompt_pay_out_other_bank_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt Pay Out TCRB</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_prompt_pay_out_tcrb_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_prompt_pay_out_tcrb_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt Pay Out Tag30</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_promptpay_out_tag_thirty_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_promptpay_out_tag_thirty_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>TCRB Bill Payment</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_tcrb_bill_payment_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_tcrb_bill_payment_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Transfer to bank account (TXN)</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_transfer_to_bank_account_txn_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_transfer_to_bank_account_txn_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Transfer to bank account (Fee)</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_transfer_to_bank_account_fee_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_transfer_to_bank_account_fee_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Online Bill Payment</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      {count_online_bill_payment_tran_out}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      {sum_online_bill_payment_tran_out.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr style={{backgroundColor: 'grey',fontWeight: 'bold'}} >
                                    <td>Total</td>
                                    <td align="right"  style={{ paddingRight: '10px' }}>&nbsp;</td>
                                    <td align="right"  style={{ paddingLeft: '10px' }}>
                                      {(sum_adjust_from_wallet_tran_out + sum_prompt_pay_out_other_bank_tran_out + sum_prompt_pay_out_tcrb_tran_out + sum_promptpay_out_tag_thirty_tran_out + sum_tcrb_bill_payment_tran_out + sum_transfer_to_bank_account_txn_tran_out + sum_transfer_to_bank_account_fee_tran_out + sum_online_bill_payment_tran_out).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                    <td align="right"  style={{ paddingRight: '10px' }}>Tran In-Out</td>
                                    <td align="right"  style={{ paddingLeft: '10px', backgroundColor:'grey',fontWeight:'bold' }}>
                                      {((sum_adjust_to_wallet + sum_prompt_pay_in_other_bank_tran_in + sum_prompt_pay_in_tcrb_tran_in + sum_promptpay_in_tag_thirty_tran_in + sum_topup_loan_disbursement_tran_in + sum_topup_direct_debit_tran_in + sum_topup_pay_roll_tran_in + sum_online_loan_topup_tran_in) - (sum_adjust_from_wallet_tran_out + sum_prompt_pay_out_other_bank_tran_out + sum_prompt_pay_out_tcrb_tran_out + sum_promptpay_out_tag_thirty_tran_out + sum_tcrb_bill_payment_tran_out + sum_transfer_to_bank_account_txn_tran_out + sum_transfer_to_bank_account_fee_tran_out + sum_online_bill_payment_tran_out)).toLocaleString('en')}
                                    </td>
                                    <td style={{backgroundColor:'grey'}}>&nbsp;</td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'dimgray', color: 'white' }} >
                                    <td>Suspend after cut-off time</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay in (Other Bank) 23:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      { count_promptpay_in_other_bank_suspend }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      { sum_promptpay_in_other_bank_suspend.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay out (Other Bank) 23:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      { count_promptpay_out_other_bank_suspend }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      { sum_promptpay_out_other_bank_suspend.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay out (TCRB) 23:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      { count_promptpay_out_tcrb_suspend }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      { sum_promptpay_out_tcrb_suspend.toLocaleString('end') }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>TCRB Bill Payment 21:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      { count_tcrb_bill_payment_suspend }
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      { sum_tcrb_bill_payment_suspend.toLocaleString('en') }
                                    </td>
                                  </tr>
                                  <tr style={{backgroundColor: 'grey',fontWeight: 'bold'}} >
                                    <td>Total</td>
                                    <td align="right"  style={{ paddingRight: '10px' }}>&nbsp;</td>
                                    <td align="right"  style={{ paddingLeft: '10px' }}>
                                      {(sum_promptpay_in_other_bank_suspend + sum_promptpay_out_other_bank_suspend + sum_promptpay_out_tcrb_suspend + sum_tcrb_bill_payment_suspend).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'dimgray', color: 'white' }} >
                                    <td>Settlement Transaction</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>TCRB Bill Payment 21:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_tcrb_bill_payment_settlement_transaction}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_tcrb_bill_payment_settlement_transaction.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Online Bill Payment 23:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_online_bill_payment_settlement_transaction}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_online_bill_payment_settlement_transaction.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay out 23:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_prompt_pay_out_settlement_transaction}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_prompt_pay_out_settlement_transaction.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Bulk Credit Sameday (D+1 8:00:00)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {transfer_to_bank_account.toLocaleString('en')}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {bulk_credit_sameday.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Bulk Credit Sameday Fee (D+1 8:00:00)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {transfer_to_bank_account_fee.toLocaleString('en')}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {bulk_credit_sameday_fee.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Topup loan disbursement 23:59:59</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_topup_loan_disbursement_settlement_transaction}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_topup_loan_disbursement_settlement_transaction.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Online loan topup 23:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_online_loan_topup_settlement_transaction}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_online_loan_topup_settlement_transaction.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay in (other bank) 23:00:00</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_prompt_pay_in_other_bank_settlement_transaction}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_prompt_pay_in_other_bank_settlement_transaction.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'grey',fontWeight: 'bold'}}>
                                    <td>Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(sum_tcrb_bill_payment_settlement_transaction + sum_online_bill_payment_settlement_transaction + sum_prompt_pay_out_settlement_transaction + bulk_credit_sameday + bulk_credit_sameday_fee + sum_topup_loan_disbursement_settlement_transaction + sum_online_loan_topup_settlement_transaction + sum_prompt_pay_in_other_bank_settlement_transaction).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'dimgray', color: 'white' }} >
                                    <td>Expenses</td>
                                    <td align="right" style={{ paddingRight: '10px' }}>
                                      No. of TXN
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }}>
                                      Total
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>KYC Complete fee (20thb)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_kyc_complete_fee_expenses}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_kyc_complete_fee_expenses.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay out (0.9thb)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_prompt_pay_out_expenses}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_prompt_pay_out_expenses.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Bulk tranfer fee (15thb)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_transfertobankaccount}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {/* {sum_count_transfertobankaccount.toLocaleString('en')} */}
                                      {(count_transfertobankaccount * 15).toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>TMDS KYC Case (manual)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_tmds_kyc_case_expense}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_tmds_kyc_case_expense.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay out (IC Fee)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_promptpay_out_ic_fee_expense}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_promptpay_out_ic_fee_expense.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay in (IC Fee)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_promptpay_in_ic_fee_expense}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_promptpay_in_ic_fee_expense.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Prompt pay out - tag30 (IC Fee)</td>
                                    <td align="right" style={{ paddingRight: '10px' }} >
                                      {count_promptpay_out_tag_thirty_expense}
                                    </td>
                                    <td align="right" style={{ paddingLeft: '10px' }} >
                                      {sum_promptpay_out_tag_thirty_expense.toLocaleString('en')}
                                    </td>
                                  </tr>
                                  <tr style={{ backgroundColor: 'grey',fontWeight: 'bold'}}>
                                    <td>Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(sum_kyc_complete_fee_expenses + sum_prompt_pay_out_expenses + (count_transfertobankaccount * 15) + sum_tmds_kyc_case_expense + sum_promptpay_out_ic_fee_expense + sum_promptpay_in_ic_fee_expense + sum_promptpay_out_tag_thirty_expense).toLocaleString('en')}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>Collectoral Memo</td>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                  <tr><td>&nbsp;</td></tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card-header">
                  {/* <div className="btn btn-success" onClick={PrintOrder}>Print</div> */}
                  <div className="btn btn-success" onClick={() => { PrintOrder(day);}}>Print</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Micropaydailyreport;
