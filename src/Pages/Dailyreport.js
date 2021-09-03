import React, { useState, useEffect, useCallback, useContext } from 'react'
import * as dayjs from 'dayjs'
import { DatePicker, Button, notification } from 'antd'
import moment from 'moment'
import { Spin } from 'antd'
import { UserContext } from '../userContext'
import { getAxios, getErrorMessage } from '../Services'
import { SearchOutlined, PrinterOutlined } from '@ant-design/icons'

const today = dayjs().subtract(1, 'days').format('YYYY-MM-DD')
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD'

//function Dailyreport() {
const Dailyreport = () => {
  const { user } = useContext(UserContext)
  const { access_token } = user || {}

  const [loading, setLoading] = useState(true)

  const ChangeAntDate = (value, dateString) => {
    //setDate(document.querySelector('#AntDate').value)
    setDate(dateString)
  }

  const PrintOrder = (day) => {
    const printableElements = document.getElementById('MainPDF').innerHTML
    const orderHtml =
      '<html><head><title></title></head><body>' +
      printableElements +
      '</body></html>'
    const oldPage = document.body.innerHTML
    document.body.innerHTML = orderHtml
    window.print()
    document.body.innerHTML = oldPage
    window.location.reload(false)
  }

  const [day, setDate] = useState(today)
  const [dayStr, setDayStr] = useState(today)

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
    wallet_to_wallet: { count_wallet_to_wallet: 0, sum_wallet_to_wallet: 0 },
    settle_merchant_online: {
      count_settle_merchant_online: 0,
      sum_settle_merchant_online: 0,
    },
    adjust_to_wallet: { count_adjust_to_wallet: 0, sum_adjust_to_wallet: 0 },
    promptpay_in_other_bank_tran_in: {
      count_prompt_pay_in_other_bank_tran_in: 0,
      sum_prompt_pay_in_other_bank_tran_in: 0,
    },
    promptpay_in_tcrb_tran_in: {
      count_prompt_pay_in_tcrb_tran_in: 0,
      sum_prompt_pay_in_tcrb_tran_in: 0,
    },
    promptpay_in_tag_thirty_tran_in: {
      count_promptpay_in_tag_thirty_tran_in: 0,
      sum_promptpay_in_tag_thirty_tran_in: 0,
    },
    topup_loan_disbursement_tran_in: {
      count_topup_loan_disbursement_tran_in: 0,
      sum_topup_loan_disbursement_tran_in: 0,
    },
    topup_loan_direct_debit_tran_in: {
      count_topup_direct_debit_tran_in: 0,
      sum_topup_direct_debit_tran_in: 0,
    },
    topup_pay_roll_tran_in: {
      count_topup_pay_roll_tran_in: 0,
      sum_topup_pay_roll_tran_in: 0,
    },
    online_loan_topup_tran_in: {
      count_online_loan_topup_tran_in: 0,
      sum_online_loan_topup_tran_in: 0,
    },
    cash_back_tran_in: { count_cash_back_tran_in: 0, sum_cash_back_tran_in: 0 },
  })

  const [collectoral, setCollectoral] = useState({
    collectoral_in: { count_collectoral_in: 0, sum_collectoral_in: 0 },
    collectoral_out: { count_collectoral_out: 0, sum_collectoral_out: 0 },
    collectoral_balance: 0,
  })

  const [tranOut, setTranOut] = useState({
    adjust_from_wallet: {
      count_adjust_from_wallet_tran_out: 0,
      sum_adjust_from_wallet_tran_out: 0,
    },
    prompt_pay_out_other_bank_tran_out: {
      count_prompt_pay_out_other_bank_tran_out: 0,
      sum_prompt_pay_out_other_bank_tran_out: 0,
    },
    prompt_pay_out_tcrb_tran_out: {
      count_prompt_pay_out_tcrb_tran_out: 0,
      sum_prompt_pay_out_tcrb_tran_out: 0,
    },
    prompt_pay_out_tag_thirty_tran_out: {
      count_promptpay_out_tag_thirty_tran_out: 0,
      sum_promptpay_out_tag_thirty_tran_out: 0,
    },
    tcrb_bill_payment_tran_out: {
      count_tcrb_bill_payment_tran_out: 0,
      sum_tcrb_bill_payment_tran_out: 0,
    },
    transfer_to_bank_account_txn_tran_out: {
      count_transfer_to_bank_account_txn_tran_out: 0,
      sum_transfer_to_bank_account_txn_tran_out: 0,
    },
    transfer_to_bank_account_fee_tran_out: {
      count_transfer_to_bank_account_fee_tran_out: 0,
      sum_transfer_to_bank_account_fee_tran_out: 0,
    },
    online_bill_payment_tran_out: {
      count_online_bill_payment_tran_out: 0,
      sum_online_bill_payment_tran_out: 0,
    },
    rtp_tcrb_loan_tran_out: {
      count_tcrb_loan_tran_out: 0,
      sum_tcrb_loan_tran_out: 0,
    },
    rtp_thai_health_tran_out: {
      count_thai_health_tran_out: 0,
      sum_thai_health_tran_out: 0,
    },
    rtp_thai_paiboon_tran_out: {
      count_thai_paiboon_tran_out: 0,
      sum_thai_paiboon_tran_out: 0,
    },
    bill_pay_mea_tran_out: {
      count_bill_pay_mea_tran_out: 0,
      sum_bill_pay_mea_tran_out: 0,
    },
    bill_pay_pea_tran_out: {
      count_bill_pay_pea_tran_out: 0,
      sum_bill_pay_pea_tran_out: 0,
    },
  })

  const [suspendMerchant, setSuspendMerchant] = useState({
    promptpay_in_tag_thirty_suspend_merchant: {
      count_promptpay_in_tag_thirty_suspend_merchant: 0,
      sum_promptpay_in_tag_thirty_suspend_merchant: 0,
    },
    promptpay_out_tag_thirty_suspend_merchant: {
      count_promptpay_out_tag_thirty_suspend_merchant: 0,
      sum_promptpay_out_tag_thirty_suspend_merchant: 0,
    },
    rtp_tcrb_loan_suspend_merchant: {
      count_rtp_tcrb_loan_suspend_merchant: 0,
      sum_rtp_tcrb_loan_suspend_merchant: 0,
    },
  })

  const [suspend, setSuspend] = useState({
    promptpay_in_other_bank_suspend: {
      count_promptpay_in_other_bank_suspend: 0,
      sum_promptpay_in_other_bank_suspend: 0,
    },
    promptpay_out_other_bank_suspend: {
      count_promptpay_out_other_bank_suspend: 0,
      sum_promptpay_out_other_bank_suspend: 0,
    },
    promptpay_out_tcrb_suspend: {
      count_promptpay_out_tcrb_suspend: 0,
      sum_promptpay_out_tcrb_suspend: 0,
    },
    tcrb_bill_payment_suspend: {
      count_tcrb_bill_payment_suspend: 0,
      sum_tcrb_bill_payment_suspend: 0,
    },
  })

  const [settleCollectoral, setSettleCollectoral] = useState({
    tcrb_bill_payment_settle_collectoral: 0,
    online_bill_payment_settle_collectoral: 0,
    prompt_pay_out_settle_collectoral: 0,
    prompt_pay_out_tag_thirty_settle_collectoral: 0,
    rtp_tcrb_loan_settle_collectoral: 0,
    bill_pay_mea_settle_collectoral: 0,
    bill_pay_pea_settle_collectoral: 0,
    ais_topup_settle_collectoral: 0,
    ais_package_settle_collectoral: 0,
    ais_billpay_settle_collectoral: 0,
    ais_fiber_settle_collectoral: 0,
    dtac_topup_settle_collectoral: 0,
    true_topup_settle_collectoral: 0,
    true_package_settle_collectoral: 0,
  })

  const [settleTransaction, setSettleTransaction] = useState({
    tcrb_bill_payment_settlement_transaction: {
      count_tcrb_bill_payment_settlement_transaction: 0,
      sum_tcrb_bill_payment_settlement_transaction: 0,
    },
    online_bill_payment_settlement_transaction: {
      count_online_bill_payment_settlement_transaction: 0,
      sum_online_bill_payment_settlement_transaction: 0,
    },
    prompt_pay_out_settlement_transaction: {
      count_prompt_pay_out_settlement_transaction: 0,
      sum_prompt_pay_out_settlement_transaction: 0,
    },
    bulk_credit_sameday_settlement_transaction: {
      transfer_to_bank_account: 0,
      bulk_credit_sameday: 0,
    },
    bulk_credit_sameday_fee_settlement_transaction: {
      transfer_to_bank_account_fee: 0,
      bulk_credit_sameday_fee: 0,
    },
    topup_loan_disbursement_settlement_transaction: {
      count_topup_loan_disbursement_settlement_transaction: 0,
      sum_topup_loan_disbursement_settlement_transaction: 0,
    },
    online_loan_topup_settlement_transaction: {
      count_online_loan_topup_settlement_transaction: 0,
      sum_online_loan_topup_settlement_transaction: 0,
    },
    prompt_pay_in_other_bank_settlement_transaction: {
      count_prompt_pay_in_other_bank_settlement_transaction: 0,
      sum_prompt_pay_in_other_bank_settlement_transaction: 0,
    },
    prompt_pay_in_tag_thirty_settlement_transaction: {
      count_prompt_pay_in_tag_thirty_settlement_transaction: 0,
      sum_prompt_pay_in_tag_thirty_settlement_transaction: 0,
    },
    prompt_pay_out_tag_thirty_settlement_transaction: {
      count_prompt_pay_out_tag_thirty_settlement_transaction: 0,
      sum_prompt_pay_out_tag_thirty_settlement_transaction: 0,
    },
    rtp_tcrb_loan_twenty_one_settlement_transaction: {
      count_rtp_tcrb_loan_twenty_one_settlement_transaction: 0,
      sum_rtp_tcrb_loan_twenty_one_settlement_transaction: 0,
    },
    bill_pay_mea_twenty_three_settlement_transaction: {
      count_bill_pay_mea_twenty_three_settlement_transaction: 0,
      sum_bill_pay_mea_twenty_three_settlement_transaction: 0,
    },
    bill_pay_pea_twenty_three_settlement_transaction: {
      count_bill_pay_pea_twenty_three_settlement_transaction: 0,
      sum_bill_pay_pea_twenty_three_settlement_transaction: 0,
    },
  })

  const [income, setIncome] = useState({
    transfer_to_bank_account_income: {
      count_transfer_to_bank_account_income: 0,
      sum_transfer_to_bank_account_income: 0,
    },
    new_binding_revolving: {
      count_new_binding_revolving_income: 0,
      sum_new_binding_revolving_income: 0,
    },
    online_loan_topup_income: {
      count_online_loan_topup_income: 0,
      sum_online_loan_topup_income: 0,
    },
    online_bill_payment_income: {
      count_online_bill_payment_income: 0,
      sum_online_bill_payment_income: 0,
    },
    rtp_tcrb_loan_income: {
      count_rtp_tcrb_loan_income: 0,
      sum_rtp_tcrb_loan_income: 0,
    },
    rtp_thai_paiboon_income: {
      count_rtp_thai_paiboon_income: 0,
      sum_rtp_thai_paiboon_income: 0,
    },
  })

  const [expenses, setExpenses] = useState({
    kyc_complete_fee_expenses: {
      count_kyc_complete_fee_expenses: 0,
      sum_kyc_complete_fee_expenses: 0,
    },
    prompt_pay_out_expenses: {
      count_prompt_pay_out_expenses: 0,
      sum_prompt_pay_out_expenses: 0,
    },
    bulk_transfer_fee_expense: {
      count_transfertobankaccount: 0,
    },
    tmds_kyc_case_expense: {
      count_tmds_kyc_case_expense: 0,
      sum_tmds_kyc_case_expense: 0,
    },
    promptpay_out_icfee_expense: {
      count_promptpay_out_ic_fee_expense: 0,
      sum_promptpay_out_ic_fee_expense: 0,
    },
    promptpay_in_icfee_expense: {
      count_promptpay_in_ic_fee_expense: 0,
      sum_promptpay_in_ic_fee_expense: 0,
    },
    promptpay_out_tag_thirty_expense: {
      count_promptpay_out_tag_thirty_expense: 0,
      sum_promptpay_out_tag_thirty_expense: 0,
    },
  })

  const [tranOutTelco, setTranOutTelco] = useState({
    ais_topup: {
      count_ais_topup_tran_out_telco: 0,
      sum_ais_topup_tran_out_telco: 0,
    },
    ais_package: {
      count_ais_package_tran_out_telco: 0,
      sum_ais_package_tran_out_telco: 0,
    },
    ais_billpay: {
      count_ais_billpay_tran_out_telco: 0,
      sum_ais_billpay_tran_out_telco: 0,
    },
    ais_fiber: {
      count_ais_fiber_tran_out_telco: 0,
      sum_ais_fiber_tran_out_telco: 0,
    },
    true_topup: {
      count_true_topup_tran_out_telco: 0,
      sum_true_topup_tran_out_telco: 0,
    },
    true_package: {
      count_true_package_tran_out_telco: 0,
      sum_true_package_tran_out_telco: 0,
    },
    dtac_topup: {
      count_dtac_topup_tran_out_telco: 0,
      sum_dtac_topup_tran_out_telco: 0,
    },
  })

  const fetchDataIntro = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseIntro = await axios.get(
      //   `/api/v1/reports/introduction?date=${day}`,
      // )

      const responseIntro = await axios({
        method: 'get',
        url: `/api/v1/reports/introduction?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })

      const { data: newwallet } = responseIntro
      const { data } = newwallet
      const { message } = newwallet
      if (message === 'Success') {
        setLoading(false)
        setIntro(data)
      }
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data introduction error : ${message}`,
      })
    }
  }

  const fetchDataTranIn = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseTransactionIn = await axios.get(
      //   `/api/v1/reports/transactionIn?date=${day}`,
      // )
      const responseTransactionIn = await axios({
        method: 'get',
        url: `/api/v1/reports/transactionIn?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: tranin } = responseTransactionIn
      const { data } = tranin
      setTranIn(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `${status} Get data transaction in error : ${message}`,
      })
    }
  }

  const fetchDataCollectoral = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseCollectoral = await axios.get(
      //   `/api/v1/reports/collectoral?date=${day}`,
      // )
      const responseCollectoral = await axios({
        method: 'get',
        url: `/api/v1/reports/collectoral?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: collectoral } = responseCollectoral
      const { data } = collectoral
      setCollectoral(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data collectoral error : ${message}`,
      })
    }
  }

  const fecthDataTranOut = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseTransactionOut = await axios.get(
      //   `/api/v1/reports/transactionOut?date=${day}`,
      // )
      const responseTransactionOut = await axios({
        method: 'get',
        url: `/api/v1/reports/transactionOut?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: tranout } = responseTransactionOut
      const { data } = tranout
      setTranOut(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data transaction out error : ${message}`,
      })
    }
  }

  const fetchDataSuspendMerchant = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseSuspendMerchant = await axios.get(
      //   `/api/v1/reports/suspendAfterCutOffTimeMerchant?date=${day}`,
      // )
      const responseSuspendMerchant = await axios({
        method: 'get',
        url: `/api/v1/reports/suspendAfterCutOffTimeMerchant?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: suspendMerchant } = responseSuspendMerchant
      const { data } = suspendMerchant
      setSuspendMerchant(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data suspend merchant error : ${message}`,
      })
    }
  }

  const fetchDataSuspend = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseSuspend = await axios.get(
      //   `/api/v1/reports/suspendAfterCutOffTime?date=${day}`,
      // )
      const responseSuspend = await axios({
        method: 'get',
        url: `/api/v1/reports/suspendAfterCutOffTime?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: suspend } = responseSuspend
      const { data } = suspend
      setSuspend(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data suspend after cut off time error : ${message}`,
      })
    }
  }

  const fetchDataSettleCollectoral = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responsSettleCollectoral = await axios.get(
      //   `/api/v1/reports/settlementCollectoral?date=${day}`,
      // )
      const responsSettleCollectoral = await axios({
        method: 'get',
        url: `/api/v1/reports/settlementCollectoral?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: settlecollectoral } = responsSettleCollectoral
      const { data } = settlecollectoral
      setSettleCollectoral(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data settlement collectoral error : ${message}`,
      })
    }
  }

  const fetchDataSettleTransaction = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responsSettleTransaction = await axios.get(
      //   `/api/v1/reports/settlementTransaction?date=${day}`,
      // )
      const responsSettleTransaction = await axios({
        method: 'get',
        url: `/api/v1/reports/settlementTransaction?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: settletransaction } = responsSettleTransaction
      const { data } = settletransaction
      setSettleTransaction(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data settlement transaction error : ${message}`,
      })
    }
  }

  const fetchDataIncome = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseIncome = await axios.get(
      //   `/api/v1/reports/income?date=${day}`,
      // )
      const responseIncome = await axios({
        method: 'get',
        url: `/api/v1/reports/income?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: income } = responseIncome
      const { data } = income
      setIncome(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data income error : ${message}`,
      })
    }
  }

  const fetchDataExpense = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseExpense = await axios.get(
      //   `/api/v1/reports/expenses?date=${day}`,
      // )
      const responseExpense = await axios({
        method: 'get',
        url: `/api/v1/reports/expenses?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: expenses } = responseExpense
      const { data } = expenses
      setExpenses(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data expense error : ${message}`,
      })
    }
  }

  const fetchDataTranOutTelco = async () => {
    try {
      const axios = getAxios({ access_token })
      // const responseTranOutTelco = await axios.get(
      //   `/api/v1/reports/tranOutTelco?date=${day}`,
      // )
      const responseTranOutTelco = await axios({
        method: 'get',
        url: `/api/v1/reports/tranOutTelco?date=${day}`,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 100 * 1000,
      })
      const { data: tranouttelco } = responseTranOutTelco
      const { data } = tranouttelco
      setTranOutTelco(data)
    } catch (err) {
      const { status, message } = getErrorMessage(err)
      notification.warning({
        message: `(${status}) Get data tranout telco error : ${message}`,
      })
    }
  }

  useEffect(() => {
    fetchDataIntro()
    fetchDataTranIn()
    fetchDataCollectoral()
    fecthDataTranOut()
    fetchDataSuspendMerchant()
    fetchDataSuspend()
    fetchDataSettleCollectoral()
    fetchDataSettleTransaction()
    fetchDataIncome()
    fetchDataExpense()
    fetchDataTranOutTelco()
  }, [])

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
    wallet_to_wallet: { count_wallet_to_wallet, sum_wallet_to_wallet },
    settle_merchant_online: {
      count_settle_merchant_online,
      sum_settle_merchant_online,
    },
    adjust_to_wallet: { count_adjust_to_wallet, sum_adjust_to_wallet },
    promptpay_in_other_bank_tran_in: {
      count_prompt_pay_in_other_bank_tran_in,
      sum_prompt_pay_in_other_bank_tran_in,
    },
    promptpay_in_tcrb_tran_in: {
      count_prompt_pay_in_tcrb_tran_in,
      sum_prompt_pay_in_tcrb_tran_in,
    },
    promptpay_in_tag_thirty_tran_in: {
      count_promptpay_in_tag_thirty_tran_in,
      sum_promptpay_in_tag_thirty_tran_in,
    },
    topup_loan_disbursement_tran_in: {
      count_topup_loan_disbursement_tran_in,
      sum_topup_loan_disbursement_tran_in,
    },
    topup_loan_direct_debit_tran_in: {
      count_topup_direct_debit_tran_in,
      sum_topup_direct_debit_tran_in,
    },
    topup_pay_roll_tran_in: {
      count_topup_pay_roll_tran_in,
      sum_topup_pay_roll_tran_in,
    },
    online_loan_topup_tran_in: {
      count_online_loan_topup_tran_in,
      sum_online_loan_topup_tran_in,
    },
    cash_back_tran_in: { count_cash_back_tran_in, sum_cash_back_tran_in },
  } = tranIn

  const {
    collectoral_in: { count_collectoral_in, sum_collectoral_in },
    collectoral_out: { count_collectoral_out, sum_collectoral_out },
    collectoral_balance,
  } = collectoral

  const {
    adjust_from_wallet: {
      count_adjust_from_wallet_tran_out,
      sum_adjust_from_wallet_tran_out,
    },
    prompt_pay_out_other_bank_tran_out: {
      count_prompt_pay_out_other_bank_tran_out,
      sum_prompt_pay_out_other_bank_tran_out,
    },
    prompt_pay_out_tcrb_tran_out: {
      count_prompt_pay_out_tcrb_tran_out,
      sum_prompt_pay_out_tcrb_tran_out,
    },
    prompt_pay_out_tag_thirty_tran_out: {
      count_promptpay_out_tag_thirty_tran_out,
      sum_promptpay_out_tag_thirty_tran_out,
    },
    tcrb_bill_payment_tran_out: {
      count_tcrb_bill_payment_tran_out,
      sum_tcrb_bill_payment_tran_out,
    },
    transfer_to_bank_account_txn_tran_out: {
      count_transfer_to_bank_account_txn_tran_out,
      sum_transfer_to_bank_account_txn_tran_out,
    },
    transfer_to_bank_account_fee_tran_out: {
      count_transfer_to_bank_account_fee_tran_out,
      sum_transfer_to_bank_account_fee_tran_out,
    },
    online_bill_payment_tran_out: {
      count_online_bill_payment_tran_out,
      sum_online_bill_payment_tran_out,
    },
    rtp_tcrb_loan_tran_out: {
      count_tcrb_loan_tran_out,
      sum_tcrb_loan_tran_out,
    },
    rtp_thai_health_tran_out: {
      count_thai_health_tran_out,
      sum_thai_health_tran_out,
    },
    rtp_thai_paiboon_tran_out: {
      count_thai_paiboon_tran_out,
      sum_thai_paiboon_tran_out,
    },
    bill_pay_mea_tran_out: {
      count_bill_pay_mea_tran_out,
      sum_bill_pay_mea_tran_out,
    },
    bill_pay_pea_tran_out: {
      count_bill_pay_pea_tran_out,
      sum_bill_pay_pea_tran_out,
    },
  } = tranOut

  const {
    promptpay_in_tag_thirty_suspend_merchant: {
      count_promptpay_in_tag_thirty_suspend_merchant,
      sum_promptpay_in_tag_thirty_suspend_merchant,
    },
    promptpay_out_tag_thirty_suspend_merchant: {
      count_promptpay_out_tag_thirty_suspend_merchant,
      sum_promptpay_out_tag_thirty_suspend_merchant,
    },
    rtp_tcrb_loan_suspend_merchant: {
      count_rtp_tcrb_loan_suspend_merchant,
      sum_rtp_tcrb_loan_suspend_merchant,
    },
  } = suspendMerchant

  const {
    promptpay_in_other_bank_suspend: {
      count_promptpay_in_other_bank_suspend,
      sum_promptpay_in_other_bank_suspend,
    },
    promptpay_out_other_bank_suspend: {
      count_promptpay_out_other_bank_suspend,
      sum_promptpay_out_other_bank_suspend,
    },
    promptpay_out_tcrb_suspend: {
      count_promptpay_out_tcrb_suspend,
      sum_promptpay_out_tcrb_suspend,
    },
    tcrb_bill_payment_suspend: {
      count_tcrb_bill_payment_suspend,
      sum_tcrb_bill_payment_suspend,
    },
  } = suspend

  const {
    tcrb_bill_payment_settle_collectoral,
    online_bill_payment_settle_collectoral,
    prompt_pay_out_settle_collectoral,
    prompt_pay_out_tag_thirty_settle_collectoral,
    rtp_tcrb_loan_settle_collectoral,
    bill_pay_mea_settle_collectoral,
    bill_pay_pea_settle_collectoral,
    ais_topup_settle_collectoral,
    ais_package_settle_collectoral,
    ais_billpay_settle_collectoral,
    ais_fiber_settle_collectoral,
    dtac_topup_settle_collectoral,
    true_topup_settle_collectoral,
    true_package_settle_collectoral,
  } = settleCollectoral

  const {
    tcrb_bill_payment_settlement_transaction: {
      count_tcrb_bill_payment_settlement_transaction,
      sum_tcrb_bill_payment_settlement_transaction,
    },
    online_bill_payment_settlement_transaction: {
      count_online_bill_payment_settlement_transaction,
      sum_online_bill_payment_settlement_transaction,
    },
    prompt_pay_out_settlement_transaction: {
      count_prompt_pay_out_settlement_transaction,
      sum_prompt_pay_out_settlement_transaction,
    },
    bulk_credit_sameday_settlement_transaction: {
      transfer_to_bank_account,
      bulk_credit_sameday,
    },
    bulk_credit_sameday_fee_settlement_transaction: {
      transfer_to_bank_account_fee,
      bulk_credit_sameday_fee,
    },
    topup_loan_disbursement_settlement_transaction: {
      count_topup_loan_disbursement_settlement_transaction,
      sum_topup_loan_disbursement_settlement_transaction,
    },
    online_loan_topup_settlement_transaction: {
      count_online_loan_topup_settlement_transaction,
      sum_online_loan_topup_settlement_transaction,
    },
    prompt_pay_in_other_bank_settlement_transaction: {
      count_prompt_pay_in_other_bank_settlement_transaction,
      sum_prompt_pay_in_other_bank_settlement_transaction,
    },
    prompt_pay_in_tag_thirty_settlement_transaction: {
      count_prompt_pay_in_tag_thirty_settlement_transaction,
      sum_prompt_pay_in_tag_thirty_settlement_transaction,
    },
    prompt_pay_out_tag_thirty_settlement_transaction: {
      count_prompt_pay_out_tag_thirty_settlement_transaction,
      sum_prompt_pay_out_tag_thirty_settlement_transaction,
    },
    rtp_tcrb_loan_twenty_one_settlement_transaction: {
      count_rtp_tcrb_loan_twenty_one_settlement_transaction,
      sum_rtp_tcrb_loan_twenty_one_settlement_transaction,
    },
    bill_pay_mea_twenty_three_settlement_transaction: {
      count_bill_pay_mea_twenty_three_settlement_transaction,
      sum_bill_pay_mea_twenty_three_settlement_transaction,
    },
    bill_pay_pea_twenty_three_settlement_transaction: {
      count_bill_pay_pea_twenty_three_settlement_transaction,
      sum_bill_pay_pea_twenty_three_settlement_transaction,
    },
  } = settleTransaction

  const {
    transfer_to_bank_account_income: {
      count_transfer_to_bank_account_income,
      sum_transfer_to_bank_account_income,
    },
    new_binding_revolving: {
      count_new_binding_revolving_income,
      sum_new_binding_revolving_income,
    },
    online_loan_topup_income: {
      count_online_loan_topup_income,
      sum_online_loan_topup_income,
    },
    online_bill_payment_income: {
      count_online_bill_payment_income,
      sum_online_bill_payment_income,
    },
    rtp_tcrb_loan_income: {
      count_rtp_tcrb_loan_income,
      sum_rtp_tcrb_loan_income,
    },
    rtp_thai_paiboon_income: {
      count_rtp_thai_paiboon_income,
      sum_rtp_thai_paiboon_income,
    },
  } = income

  const {
    kyc_complete_fee_expenses: {
      count_kyc_complete_fee_expenses,
      sum_kyc_complete_fee_expenses,
    },
    prompt_pay_out_expenses: {
      count_prompt_pay_out_expenses,
      sum_prompt_pay_out_expenses,
    },
    bulk_transfer_fee_expense: { count_transfertobankaccount },
    tmds_kyc_case_expense: {
      count_tmds_kyc_case_expense,
      sum_tmds_kyc_case_expense,
    },
    promptpay_out_icfee_expense: {
      count_promptpay_out_ic_fee_expense,
      sum_promptpay_out_ic_fee_expense,
    },
    promptpay_in_icfee_expense: {
      count_promptpay_in_ic_fee_expense,
      sum_promptpay_in_ic_fee_expense,
    },
    promptpay_out_tag_thirty_expense: {
      count_promptpay_out_tag_thirty_expense,
      sum_promptpay_out_tag_thirty_expense,
    },
  } = expenses

  const {
    ais_topup: { count_ais_topup_tran_out_telco, sum_ais_topup_tran_out_telco },
    ais_package: {
      count_ais_package_tran_out_telco,
      sum_ais_package_tran_out_telco,
    },
    ais_billpay: {
      count_ais_billpay_tran_out_telco,
      sum_ais_billpay_tran_out_telco,
    },
    ais_fiber: { count_ais_fiber_tran_out_telco, sum_ais_fiber_tran_out_telco },
    true_topup: {
      count_true_topup_tran_out_telco,
      sum_true_topup_tran_out_telco,
    },
    true_package: {
      count_true_package_tran_out_telco,
      sum_true_package_tran_out_telco,
    },
    dtac_topup: {
      count_dtac_topup_tran_out_telco,
      sum_dtac_topup_tran_out_telco,
    },
  } = tranOutTelco

  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header">
                <h1 className="m-0" style={{ color: '#1890ff' }}>
                  Daily Report
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header text-left">
                {' '}
                Report of date : {day}
              </div>
              <div className="card-body">
                <div className="form-group">
                  <div className="col-sm-4 fl">
                    <form>
                      <div className="form-group">
                        <div className="input-group-prepend">
                          <DatePicker
                            id="AntDate"
                            defaultValue={moment(day, dateFormat)}
                            format={dateFormat}
                            onChange={(_, dateString) => {
                              setDate(dateString)
                            }}
                          />
                          <span className="w5">&nbsp;</span>
                          <Button
                            style={{
                              backgroundColor: '#28a745',
                              borderColor: '#28a745',
                            }}
                            value="large"
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={() => {
                              fetchDataIntro(day)
                              fetchDataTranIn(day)
                              fetchDataCollectoral(day)
                              fecthDataTranOut(day)
                              fetchDataSuspendMerchant(day)
                              fetchDataSuspend(day)
                              fetchDataSettleCollectoral(day)
                              fetchDataSettleTransaction(day)
                              fetchDataIncome(day)
                              fetchDataExpense(day)
                              fetchDataTranOutTelco(day)
                              setDayStr(day)
                              setLoading(true)
                            }}
                          >
                            Search
                          </Button>
                          <span className="w5">&nbsp;</span>

                          <Button
                            value="large"
                            type="primary"
                            icon={<PrinterOutlined />}
                            onClick={() => {
                              PrintOrder(day)
                            }}
                          >
                            Print
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <br />
                  <br />
                  <div className="col-12" id="MainPDF">
                    <table
                      className="table table-bordered table-hover"
                      style={{
                        width: '100%',
                        margin: 'auto',
                        backgroundColor: 'royalblue',
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: 'royalblue' }}>
                          <td
                            align="left"
                            className="title-micropay"
                            style={{
                              color: '#000',
                              fontSize: '30px',
                              fontWeight: 'bold',
                              width: '50%',
                              backgroundColor: 'royalblue',
                              verticalAlign: 'middle',
                            }}
                          >
                            Micro Pay Daily Summary Report
                          </td>
                          <td
                            align="right"
                            style={{
                              width: '50%',
                              backgroundColor: 'royalblue',
                            }}
                          >
                            <img src="LogoTMD.png" alt="" />
                          </td>
                        </tr>
                      </thead>
                    </table>
                    <Spin spinning={loading} tip="Loading">
                      {/* {loading ? (
                      <Spin size="large" />
                    ) : ( */}
                      <table
                        style={{
                          width: '100%',
                          margin: 'auto',
                          border: '1px solid',
                          fontSize: '12px',
                        }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ width: '50%', border: '1px solid' }}>
                              <table style={{ width: '100%' }}>
                                <tbody>
                                  <tr>
                                    <td align="left">
                                      Report Date :
                                      <span style={{ paddingLeft: '5px' }}>
                                        {dayStr}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">New Wallet </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {new_wallet.toLocaleString('en')}
                                    </td>
                                    <td
                                      align="left"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Wallet
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">No of Wallet</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {no_of_wallet.toLocaleString('en')}
                                    </td>
                                    <td
                                      align="left"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Wallet
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Wallet Balance</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {wallet_balance.toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td
                                      align="left"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Thb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Diff. Balance (From previous day)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {diff_wallet_balance.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                    <td
                                      align="left"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Thb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Net Float (Transaction)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {(
                                        sum_adjust_to_wallet +
                                        sum_prompt_pay_in_other_bank_tran_in +
                                        sum_prompt_pay_in_tcrb_tran_in +
                                        sum_promptpay_in_tag_thirty_tran_in +
                                        sum_topup_loan_disbursement_tran_in +
                                        sum_topup_direct_debit_tran_in +
                                        sum_topup_pay_roll_tran_in +
                                        sum_online_loan_topup_tran_in +
                                        sum_cash_back_tran_in -
                                        (sum_adjust_from_wallet_tran_out +
                                          sum_prompt_pay_out_other_bank_tran_out +
                                          sum_prompt_pay_out_tcrb_tran_out +
                                          sum_promptpay_out_tag_thirty_tran_out +
                                          sum_tcrb_bill_payment_tran_out +
                                          sum_transfer_to_bank_account_txn_tran_out +
                                          sum_transfer_to_bank_account_fee_tran_out +
                                          sum_online_bill_payment_tran_out +
                                          sum_tcrb_loan_tran_out +
                                          sum_thai_health_tran_out +
                                          sum_thai_paiboon_tran_out +
                                          sum_bill_pay_mea_tran_out +
                                          sum_bill_pay_pea_tran_out) -
                                        (sum_ais_topup_tran_out_telco +
                                          sum_ais_package_tran_out_telco +
                                          sum_ais_billpay_tran_out_telco +
                                          sum_ais_fiber_tran_out_telco) -
                                        sum_dtac_topup_tran_out_telco -
                                        (sum_true_topup_tran_out_telco +
                                          sum_true_package_tran_out_telco)
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                      {/* {(
                                        sum_adjust_to_wallet +
                                        sum_prompt_pay_in_other_bank_tran_in +
                                        sum_prompt_pay_in_tcrb_tran_in +
                                        sum_promptpay_in_tag_thirty_tran_in +
                                        sum_topup_loan_disbursement_tran_in +
                                        sum_topup_direct_debit_tran_in +
                                        sum_topup_pay_roll_tran_in +
                                        sum_online_loan_topup_tran_in +
                                        sum_cash_back_tran_in -
                                        (sum_adjust_from_wallet_tran_out +
                                          sum_prompt_pay_out_other_bank_tran_out +
                                          sum_prompt_pay_out_tcrb_tran_out +
                                          sum_promptpay_out_tag_thirty_tran_out +
                                          sum_tcrb_bill_payment_tran_out +
                                          sum_transfer_to_bank_account_txn_tran_out +
                                          sum_transfer_to_bank_account_fee_tran_out +
                                          sum_online_bill_payment_tran_out +
                                          sum_tcrb_loan_tran_out +
                                          sum_thai_health_tran_out +
                                          sum_thai_paiboon_tran_out +
                                          sum_bill_pay_mea_tran_out +
                                          sum_bill_pay_pea_tran_out)
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })} */}
                                    </td>
                                    <td
                                      align="left"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Thb
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Diff. Balance vs Transaction
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {(
                                        diff_wallet_balance -
                                        (sum_adjust_to_wallet +
                                          sum_prompt_pay_in_other_bank_tran_in +
                                          sum_prompt_pay_in_tcrb_tran_in +
                                          sum_promptpay_in_tag_thirty_tran_in +
                                          sum_topup_loan_disbursement_tran_in +
                                          sum_topup_direct_debit_tran_in +
                                          sum_topup_pay_roll_tran_in +
                                          sum_online_loan_topup_tran_in +
                                          sum_cash_back_tran_in -
                                          (sum_adjust_from_wallet_tran_out +
                                            sum_prompt_pay_out_other_bank_tran_out +
                                            sum_prompt_pay_out_tcrb_tran_out +
                                            sum_promptpay_out_tag_thirty_tran_out +
                                            sum_tcrb_bill_payment_tran_out +
                                            sum_transfer_to_bank_account_txn_tran_out +
                                            sum_transfer_to_bank_account_fee_tran_out +
                                            sum_online_bill_payment_tran_out +
                                            sum_tcrb_loan_tran_out +
                                            sum_thai_health_tran_out +
                                            sum_thai_paiboon_tran_out +
                                            sum_bill_pay_mea_tran_out +
                                            sum_bill_pay_pea_tran_out) -
                                          (sum_ais_topup_tran_out_telco +
                                            sum_ais_package_tran_out_telco +
                                            sum_ais_billpay_tran_out_telco +
                                            sum_ais_fiber_tran_out_telco) -
                                          sum_dtac_topup_tran_out_telco -
                                          (sum_true_topup_tran_out_telco +
                                            sum_true_package_tran_out_telco))
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                      {/* {(
                                        diff_wallet_balance -
                                        (sum_adjust_to_wallet +
                                          sum_prompt_pay_in_other_bank_tran_in +
                                          sum_prompt_pay_in_tcrb_tran_in +
                                          sum_promptpay_in_tag_thirty_tran_in +
                                          sum_topup_loan_disbursement_tran_in +
                                          sum_topup_direct_debit_tran_in +
                                          sum_topup_pay_roll_tran_in +
                                          sum_online_loan_topup_tran_in +
                                          sum_cash_back_tran_in -
                                          (sum_adjust_from_wallet_tran_out +
                                            sum_prompt_pay_out_other_bank_tran_out +
                                            sum_prompt_pay_out_tcrb_tran_out +
                                            sum_promptpay_out_tag_thirty_tran_out +
                                            sum_tcrb_bill_payment_tran_out +
                                            sum_transfer_to_bank_account_txn_tran_out +
                                            sum_transfer_to_bank_account_fee_tran_out +
                                            sum_online_bill_payment_tran_out +
                                            sum_tcrb_loan_tran_out +
                                            sum_thai_health_tran_out +
                                            sum_thai_paiboon_tran_out +
                                            sum_bill_pay_mea_tran_out +
                                            sum_bill_pay_pea_tran_out))
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })} */}
                                    </td>
                                    <td
                                      align="left"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Thb
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Transaction In</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Wallet to Wallet</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_wallet_to_wallet === undefined
                                        ? 0
                                        : count_wallet_to_wallet}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_wallet_to_wallet === undefined
                                        ? 0.0
                                        : sum_wallet_to_wallet.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Settle Merchant Online</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_settle_merchant_online ===
                                      undefined
                                        ? 0.0
                                        : count_settle_merchant_online}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_settle_merchant_online === undefined
                                        ? 0
                                        : sum_settle_merchant_online.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
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
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Transaction In</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Adjust to Wallet</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_adjust_to_wallet}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_adjust_to_wallet.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt Pay In Other Bank
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_prompt_pay_in_other_bank_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_in_other_bank_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Prompt Pay In TCRB</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_prompt_pay_in_tcrb_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_in_tcrb_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Prompt Pay In Tag30</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_in_tag_thirty_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_in_tag_thirty_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Top up Loan disbursement
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_topup_loan_disbursement_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_topup_loan_disbursement_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Top up Direct Debit</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_topup_direct_debit_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_topup_direct_debit_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Topup Pay roll</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_topup_pay_roll_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_topup_pay_roll_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Online Loan Top Up</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_online_loan_topup_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_online_loan_topup_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Cash back</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_cash_back_tran_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_cash_back_tran_in.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                  </tr>

                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {(
                                        sum_adjust_to_wallet +
                                        sum_prompt_pay_in_other_bank_tran_in +
                                        sum_prompt_pay_in_tcrb_tran_in +
                                        sum_promptpay_in_tag_thirty_tran_in +
                                        sum_topup_loan_disbursement_tran_in +
                                        sum_topup_direct_debit_tran_in +
                                        sum_topup_pay_roll_tran_in +
                                        sum_online_loan_topup_tran_in +
                                        sum_cash_back_tran_in
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  {/* <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr> */}
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Transaction Out-TELCO</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    ></td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    ></td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">AIS</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Top up</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_ais_topup_tran_out_telco ===
                                      undefined
                                        ? 0
                                        : count_ais_topup_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_ais_topup_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_ais_topup_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Package</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {/* {count_ais_package_tran_out_telco} */}
                                      {count_ais_package_tran_out_telco ===
                                      undefined
                                        ? 0
                                        : count_ais_package_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_ais_package_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_ais_package_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Bill payment</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {/* {count_ais_billpay_tran_out_telco} */}
                                      {count_ais_billpay_tran_out_telco ===
                                      undefined
                                        ? 0
                                        : count_ais_billpay_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_ais_billpay_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_ais_billpay_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                      {/* {sum_ais_billpay_tran_out_telco.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )} */}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Fiber</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {/* {count_ais_fiber_tran_out_telco} */}
                                      {count_ais_fiber_tran_out_telco ===
                                      undefined
                                        ? 0
                                        : count_ais_fiber_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_ais_fiber_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_ais_fiber_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                      {/* {sum_ais_fiber_tran_out_telco.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )} */}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_ais_topup_tran_out_telco +
                                        count_ais_package_tran_out_telco +
                                        count_ais_billpay_tran_out_telco +
                                        count_ais_fiber_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {(
                                        sum_ais_topup_tran_out_telco +
                                        sum_ais_package_tran_out_telco +
                                        sum_ais_billpay_tran_out_telco +
                                        sum_ais_fiber_tran_out_telco
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">TRUE</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Top up</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_true_topup_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {/* {sum_true_topup_tran_out_telco.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )} */}
                                      {sum_true_topup_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_true_topup_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Package Internet</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_true_package_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {/* {sum_true_package_tran_out_telco.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )} */}
                                      {sum_true_package_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_true_package_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_true_topup_tran_out_telco +
                                        count_true_package_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {(
                                        sum_true_topup_tran_out_telco +
                                        sum_true_package_tran_out_telco
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">
                                      Suspend affter cut-off Time -Merchant
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt Pay in Tag30 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_promptpay_in_tag_thirty_suspend_merchant
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_in_tag_thirty_suspend_merchant.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt Pay Out Tag30 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_promptpay_out_tag_thirty_suspend_merchant
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_out_tag_thirty_suspend_merchant.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">RTP TCRB Loan 21:00:00</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_rtp_tcrb_loan_suspend_merchant}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_rtp_tcrb_loan_suspend_merchant.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                  </tr>
                                  {/* 
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
                                                    </tr> */}
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {(
                                        sum_promptpay_in_tag_thirty_suspend_merchant +
                                        sum_promptpay_out_tag_thirty_suspend_merchant +
                                        sum_rtp_tcrb_loan_suspend_merchant
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Settlement Collectoral</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      Settlement time
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">TCRB Bill Payment</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      21:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {tcrb_bill_payment_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Online Bill Payment</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {online_bill_payment_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Prompt pay out</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {prompt_pay_out_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Prompt Pay Out Tag30</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {prompt_pay_out_tag_thirty_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">RTP TCRB Loan</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      21:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {rtp_tcrb_loan_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td align="left">Bill Payment-MEA</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:50:50
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {bill_pay_mea_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td align="left">Bill Payment-PEA</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:50:50
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {bill_pay_pea_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td align="left">AIS-Top up</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {ais_topup_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">AIS-Package</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {ais_package_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">AIS-Bill payment</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {ais_billpay_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">AIS-Fiber</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {ais_fiber_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">DTAC-Top up</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {dtac_topup_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">TRUEMOVE-Top up</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {true_topup_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">TRUEMOVE-Package</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {true_package_settle_collectoral.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <td>&nbsp;</td>
                                  </tr> */}
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(
                                        tcrb_bill_payment_settle_collectoral +
                                        online_bill_payment_settle_collectoral +
                                        prompt_pay_out_settle_collectoral +
                                        prompt_pay_out_tag_thirty_settle_collectoral +
                                        rtp_tcrb_loan_settle_collectoral +
                                        bill_pay_mea_settle_collectoral +
                                        bill_pay_pea_settle_collectoral +
                                        ais_topup_settle_collectoral +
                                        ais_package_settle_collectoral +
                                        ais_billpay_settle_collectoral +
                                        ais_fiber_settle_collectoral +
                                        dtac_topup_settle_collectoral +
                                        true_topup_settle_collectoral +
                                        true_package_settle_collectoral
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Income</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      No. of TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Total
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Tranfer to bank account (20thb)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_transfer_to_bank_account_income}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_transfer_to_bank_account_income.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      New binding - Revolving
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_new_binding_revolving_income}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_new_binding_revolving_income.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Online loan top up (5thb)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_online_loan_topup_income}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_online_loan_topup_income.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Online bill payment (5thb)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_online_bill_payment_income}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_online_bill_payment_income.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">RTP TCRB Loan (5thb)</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_rtp_tcrb_loan_income}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_rtp_tcrb_loan_income.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      RTP Thai Paiboon (5thb)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_rtp_thai_paiboon_income}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_rtp_thai_paiboon_income.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(
                                        sum_transfer_to_bank_account_income +
                                        sum_new_binding_revolving_income +
                                        sum_online_loan_topup_income +
                                        sum_online_bill_payment_income +
                                        sum_rtp_tcrb_loan_income +
                                        sum_rtp_thai_paiboon_income
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td style={{ width: '50%', border: '1px solid' }}>
                              <table
                                style={{ width: '100%', marginTop: '0px' }}
                              >
                                <tbody>
                                  <tr>
                                    <td colSpan={4}>
                                      <table
                                        border="1"
                                        style={{ width: '100%' }}
                                      >
                                        <tbody>
                                          <tr>
                                            <td align="left">Report by</td>
                                            <td align="left">Checker by</td>
                                          </tr>
                                          <tr>
                                            <td
                                              align="left"
                                              style={{ height: '55px' }}
                                            ></td>
                                            <td align="left"></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2} align="left">
                                      Total Balance in Micro Pay system
                                    </td>
                                    <td align="right">
                                      {total_balance_in_micro_pay.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                      <span style={{ paddingLeft: '10px' }}>
                                        Thb
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2} align="left">
                                      Statement Ending Balance (Float)
                                    </td>
                                    <td align="right">
                                      {statement_ending_balance.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                      <span style={{ paddingLeft: '10px' }}>
                                        Thb
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={2} align="left">
                                      Statement Incoming Balance (Direct Debit))
                                    </td>
                                    <td align="right">
                                      {statement_incoming_balance.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                      <span style={{ paddingLeft: '10px' }}>
                                        Thb
                                      </span>
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Collectoral</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Collectoral In</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_collectoral_in}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_collectoral_in.toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Collectoral Out</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_collectoral_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_collectoral_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(
                                        sum_collectoral_in - sum_collectoral_out
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Collectoral Balance</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {collectoral_balance.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Transaction Out</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Adjust from Wallet</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_adjust_from_wallet_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_adjust_from_wallet_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt Pay Out Other Bank
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_prompt_pay_out_other_bank_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_out_other_bank_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Prompt Pay Out TCRB</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_prompt_pay_out_tcrb_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_out_tcrb_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Prompt Pay Out Tag30</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_out_tag_thirty_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_out_tag_thirty_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">TCRB Bill Payment</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_tcrb_bill_payment_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_tcrb_bill_payment_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Transfer to bank account (TXN)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_transfer_to_bank_account_txn_tran_out
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_transfer_to_bank_account_txn_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Transfer to bank account (Fee)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_transfer_to_bank_account_fee_tran_out
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_transfer_to_bank_account_fee_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Online Bill Payment</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_online_bill_payment_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_online_bill_payment_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td align="left">RTP TCRB Loan</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_tcrb_loan_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_tcrb_loan_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">RTP Thai Health</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_thai_health_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_thai_health_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">RTP Thai Paiboon</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_thai_paiboon_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_thai_paiboon_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Bill Payment-MEA</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_bill_pay_mea_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_bill_pay_mea_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Bill Payment-PEA</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_bill_pay_pea_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_bill_pay_pea_tran_out.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  {/* <tr>
                                    <td>&nbsp;</td>
                                    <td align="right">&nbsp;</td>
                                    <td align="left">&nbsp;</td>
                                  </tr> */}
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {(
                                        sum_adjust_from_wallet_tran_out +
                                        sum_prompt_pay_out_other_bank_tran_out +
                                        sum_prompt_pay_out_tcrb_tran_out +
                                        sum_promptpay_out_tag_thirty_tran_out +
                                        sum_tcrb_bill_payment_tran_out +
                                        sum_transfer_to_bank_account_txn_tran_out +
                                        sum_transfer_to_bank_account_fee_tran_out +
                                        sum_online_bill_payment_tran_out +
                                        sum_tcrb_loan_tran_out +
                                        sum_thai_health_tran_out +
                                        sum_thai_paiboon_tran_out +
                                        sum_bill_pay_mea_tran_out +
                                        sum_bill_pay_pea_tran_out
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  {/* <tr>
                                    <td>&nbsp;</td>
                                  </tr> */}
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">&nbsp;</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    ></td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    ></td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">DTAC</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">Top up</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_dtac_topup_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_dtac_topup_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_dtac_topup_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                      {/* {sum_dtac_topup_tran_out_telco.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )} */}
                                    </td>
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
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_dtac_topup_tran_out_telco}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_dtac_topup_tran_out_telco ===
                                      undefined
                                        ? 0.0
                                        : sum_dtac_topup_tran_out_telco.toLocaleString(
                                            'en',
                                            { minimumFractionDigits: 2 },
                                          )}
                                      {/* {sum_dtac_topup_tran_out_telco.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )} */}
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
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">&nbsp;</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    ></td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td>&nbsp;</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      Tran In-Out
                                    </td>
                                    <td
                                      align="right"
                                      style={{
                                        paddingLeft: '10px',
                                        backgroundColor: 'grey',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {(
                                        sum_adjust_to_wallet +
                                        sum_prompt_pay_in_other_bank_tran_in +
                                        sum_prompt_pay_in_tcrb_tran_in +
                                        sum_promptpay_in_tag_thirty_tran_in +
                                        sum_topup_loan_disbursement_tran_in +
                                        sum_topup_direct_debit_tran_in +
                                        sum_topup_pay_roll_tran_in +
                                        sum_online_loan_topup_tran_in +
                                        sum_cash_back_tran_in -
                                        (sum_adjust_from_wallet_tran_out +
                                          sum_prompt_pay_out_other_bank_tran_out +
                                          sum_prompt_pay_out_tcrb_tran_out +
                                          sum_promptpay_out_tag_thirty_tran_out +
                                          sum_tcrb_bill_payment_tran_out +
                                          sum_transfer_to_bank_account_txn_tran_out +
                                          sum_transfer_to_bank_account_fee_tran_out +
                                          sum_online_bill_payment_tran_out +
                                          sum_tcrb_loan_tran_out +
                                          sum_thai_health_tran_out +
                                          sum_thai_paiboon_tran_out +
                                          sum_bill_pay_mea_tran_out +
                                          sum_bill_pay_pea_tran_out) -
                                        (sum_ais_topup_tran_out_telco +
                                          sum_ais_package_tran_out_telco +
                                          sum_ais_billpay_tran_out_telco +
                                          sum_ais_fiber_tran_out_telco) -
                                        sum_dtac_topup_tran_out_telco -
                                        (sum_true_topup_tran_out_telco +
                                          sum_true_package_tran_out_telco)
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}

                                      {/* {(
                                        sum_adjust_to_wallet +
                                        sum_prompt_pay_in_other_bank_tran_in +
                                        sum_prompt_pay_in_tcrb_tran_in +
                                        sum_promptpay_in_tag_thirty_tran_in +
                                        sum_topup_loan_disbursement_tran_in +
                                        sum_topup_direct_debit_tran_in +
                                        sum_topup_pay_roll_tran_in +
                                        sum_online_loan_topup_tran_in +
                                        sum_cash_back_tran_in -
                                        (sum_adjust_from_wallet_tran_out +
                                          sum_prompt_pay_out_other_bank_tran_out +
                                          sum_prompt_pay_out_tcrb_tran_out +
                                          sum_promptpay_out_tag_thirty_tran_out +
                                          sum_tcrb_bill_payment_tran_out +
                                          sum_transfer_to_bank_account_txn_tran_out +
                                          sum_transfer_to_bank_account_fee_tran_out +
                                          sum_online_bill_payment_tran_out +
                                          sum_tcrb_loan_tran_out +
                                          sum_thai_health_tran_out +
                                          sum_thai_paiboon_tran_out +
                                          sum_bill_pay_mea_tran_out +
                                          sum_bill_pay_pea_tran_out)
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })} */}
                                    </td>
                                    <td style={{ backgroundColor: 'grey' }}>
                                      &nbsp;
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">
                                      Suspend after cut-off time
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay in (Other Bank) 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_in_other_bank_suspend}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_in_other_bank_suspend.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay out (Other Bank) 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_out_other_bank_suspend}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_out_other_bank_suspend.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay out (TCRB) 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_out_tcrb_suspend}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_out_tcrb_suspend.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      TCRB Bill Payment 21:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_tcrb_bill_payment_suspend}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_tcrb_bill_payment_suspend.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {(
                                        sum_promptpay_in_other_bank_suspend +
                                        sum_promptpay_out_other_bank_suspend +
                                        sum_promptpay_out_tcrb_suspend +
                                        sum_tcrb_bill_payment_suspend
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Settlement Transaction</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Amount
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      TCRB Bill Payment 21:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_tcrb_bill_payment_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_tcrb_bill_payment_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Online Bill Payment 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_online_bill_payment_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_online_bill_payment_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay out 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_prompt_pay_out_settlement_transaction +
                                        count_prompt_pay_out_tcrb_tran_out}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {/* {sum_prompt_pay_out_settlement_transaction.toLocaleString('en', {minimumFractionDigits: 2})}
                                                        /
                                                        {sum_prompt_pay_out_tcrb_tran_out.toLocaleString('en', {minimumFractionDigits: 2})} */}
                                      {(
                                        sum_prompt_pay_out_settlement_transaction +
                                        sum_prompt_pay_out_tcrb_tran_out
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Bulk Credit Sameday (D+1 8:00:00)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {transfer_to_bank_account}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {bulk_credit_sameday.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Bulk Credit Sameday Fee (D+1 8:00:00)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {transfer_to_bank_account_fee}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {bulk_credit_sameday_fee.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Topup loan disbursement 23:59:59
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_topup_loan_disbursement_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_topup_loan_disbursement_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Online loan topup 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_online_loan_topup_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_online_loan_topup_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay in (other bank) 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_prompt_pay_in_other_bank_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_in_other_bank_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt Pay In Tag30 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_prompt_pay_in_tag_thirty_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_in_tag_thirty_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt Pay Out Tag30 23:00:00
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_prompt_pay_out_tag_thirty_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_out_tag_thirty_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">RTP TCRB Loan 21:00:00</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_rtp_tcrb_loan_twenty_one_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_rtp_tcrb_loan_twenty_one_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td align="left">
                                      Bill Payment-MEA 23:50:50
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_bill_pay_mea_twenty_three_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_bill_pay_mea_twenty_three_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>

                                  <tr>
                                    <td align="left">
                                      Bill Payment-PEA 23:50:50
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {
                                        count_bill_pay_pea_twenty_three_settlement_transaction
                                      }
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_bill_pay_pea_twenty_three_settlement_transaction.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">&nbsp;</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      &nbsp;
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(
                                        sum_tcrb_bill_payment_settlement_transaction +
                                        sum_online_bill_payment_settlement_transaction +
                                        sum_prompt_pay_out_settlement_transaction +
                                        bulk_credit_sameday +
                                        bulk_credit_sameday_fee +
                                        sum_topup_loan_disbursement_settlement_transaction +
                                        sum_online_loan_topup_settlement_transaction +
                                        sum_prompt_pay_in_other_bank_settlement_transaction +
                                        sum_prompt_pay_in_tag_thirty_settlement_transaction +
                                        sum_prompt_pay_out_tag_thirty_settlement_transaction +
                                        sum_rtp_tcrb_loan_twenty_one_settlement_transaction +
                                        sum_bill_pay_mea_twenty_three_settlement_transaction +
                                        sum_bill_pay_pea_twenty_three_settlement_transaction
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'dimgray',
                                      color: 'white',
                                    }}
                                  >
                                    <td align="left">Expenses</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      No. of TXN
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      Total
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      KYC Complete fee (20thb)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_kyc_complete_fee_expenses}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_kyc_complete_fee_expenses.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay out (0.9thb)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_prompt_pay_out_expenses}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_prompt_pay_out_expenses.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Bulk tranfer fee (15thb)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_transfertobankaccount}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {(
                                        count_transfertobankaccount * 15
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">TMDS KYC Case (manual)</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_tmds_kyc_case_expense}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_tmds_kyc_case_expense.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay out (IC Fee)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_out_ic_fee_expense}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_out_ic_fee_expense.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">Prompt pay in (IC Fee)</td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_in_ic_fee_expense}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_in_ic_fee_expense.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="left">
                                      Prompt pay out - tag30 (IC Fee)
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingRight: '10px' }}
                                    >
                                      {count_promptpay_out_tag_thirty_expense}
                                    </td>
                                    <td
                                      align="right"
                                      style={{ paddingLeft: '10px' }}
                                    >
                                      {sum_promptpay_out_tag_thirty_expense.toLocaleString(
                                        'en',
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      backgroundColor: 'grey',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    <td align="left">Total</td>
                                    <td>&nbsp;</td>
                                    <td align="right">
                                      {(
                                        sum_kyc_complete_fee_expenses +
                                        sum_prompt_pay_out_expenses +
                                        count_transfertobankaccount * 15 +
                                        sum_tmds_kyc_case_expense +
                                        sum_promptpay_out_ic_fee_expense +
                                        sum_promptpay_in_ic_fee_expense +
                                        sum_promptpay_out_tag_thirty_expense
                                      ).toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td>&nbsp;</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Spin>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dailyreport
