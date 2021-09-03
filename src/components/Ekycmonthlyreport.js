import axios from 'axios';
import React, { useState,useEffect,useCallback } from 'react';
import ReactToExcel from 'react-html-table-to-excel';
import * as ReactBootStrap from 'react-bootstrap';

// const Loader = () => (
//     <div class="divLoader">
//         <svg class="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
//         <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
//         </svg>
//     </div>
// );

function Ekycmonthlyreport() {

    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState();
    let monthstr = month+"-"+"01";

    const [data, setData] = useState([]);
    const [tmdsKycAll, setTmdsKycAll] = useState(0);
    const [tcrbKycAll, setTcrbKycAll] = useState(0);
    const searchData = useCallback(async (monthstr) => {
        setLoading(false);
        try{
            const responseEKYCmonthly = await axios.get(`http://localhost:9000/api/v1/reports/eKycMonthly?date=${monthstr}`)
            const { data: ekycmonthly } = responseEKYCmonthly
            const { data } = ekycmonthly
            setData(data)
            setLoading(true);
        }catch(err){
            Error(err)
        }
    }, [])
    const fetchDataTmdskyc = useCallback(async(monthstr) => {
        try{
            const responseTmdskyc = await axios.get(`http://localhost:9000/api/v1/reports/eKycMonthlyTmdsAll?date=${monthstr}`)
            const {data: tmdskycall} = responseTmdskyc
            const {data} = tmdskycall
            setTmdsKycAll(data);
        }catch(err){
            Error(err)
        }
    },[])

    const fetchDataTcrbkyc = useCallback(async(monthstr) => {
        try{
            const responseTcrbkyc = await axios.get(`http://localhost:9000/api/v1/reports/eKycMonthlyTcrbAll?date=${monthstr}`)
            const {data:TcrbKyc} = responseTcrbkyc;
            const {data} = TcrbKyc;
            setTcrbKycAll(data);
        }catch(err){ 
            Error(err);
        }
    },[])

    useEffect(() => {
        searchData(monthstr)
    }, [])

    const renderTable = () => {
        let i = 0;
        let AgentType = "";
        return data.map(ekycmonthly => {
            i++
            if(ekycmonthly.AgentID == "Agent1" || ekycmonthly.AgentID == "KycTablet1" || ekycmonthly.AgentID == "KycTablet2" || ekycmonthly.AgentID == "Tassana.kyc"){
                AgentType = "TMDS";
            }else{
                AgentType = "TCRB";
            }
            return (
                <tr>
                    <td>{i}</td>
                    <td align="center">{ekycmonthly.KYCDate}</td>
                    <td align="center">{ekycmonthly.KYCTime}</td>
                    <td align="center">{ekycmonthly.AgentID}</td>
                    <td align="center">{ekycmonthly.Agentemail}</td>
                    <td align="center">{ekycmonthly.AgentNameLastname}</td>
                    <td align="center">{ekycmonthly.KYCStatus}</td>
                    <td align="center">{ekycmonthly.Consumerwalletid}</td>
                    <td align="center">{ekycmonthly.KYCRespond}</td>
                    <td align="center">{ekycmonthly.DOPARespond}</td>
                    <td align="center">{AgentType}</td>
                </tr>
            )
        })
    }

    return(
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1 className="m-0">eKYC Monthly Report</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header"> Report of month : {month}</div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <div className="col-sm-4 fl">
                                            <input onChange={e => setMonth(e.target.value)} type="month" id="txtDate" name="txtDate" value={month} />
                                            <span>&nbsp;</span>
                                            <button className="btn btn-success" type="button" onClick={() => { searchData(monthstr); fetchDataTmdskyc(monthstr); fetchDataTcrbkyc(monthstr);}}>Search</button>
                                        </div>
                                        <br />
                                        <br />
                                        <div className="col-12" id="table-to-xls">
                                            <div className="card-body table-responsive p-0" style={{height:'85vh'}}>
                                                <table id="" className="table table-head-fixed text-nowrap table-hover">
                                                    <tr>
                                                        <th align="left" colSpan="2" className="bd0impt">TMDS eKYC : {tmdsKycAll.toLocaleString('en')}</th>
                                                    </tr>
                                                    <tr>
                                                        <th align="left" colSpan="2" className="bd0impt">TCRB eKYC : {tcrbKycAll.toLocaleString('en')}</th>
                                                    </tr>
                                                    <tr>
                                                        <th align="left" colSpan="2" className="bd0impt">Total Count : {(tmdsKycAll + tcrbKycAll).toLocaleString('en')}</th>
                                                    </tr>
                                                    <tr>
                                                        <th align="left" colSpan="2" className="bd0impt">TCRB eKYCX Total Amount : {((tcrbKycAll) * 20).toLocaleString('en')}</th>
                                                    </tr>
                                                    <thead>
                                                        <tr>
                                                            <th className="bgblue text-white">No</th>
                                                            <th className="text-center bgblue text-white">KYC Date</th>
                                                            <th className="text-center bgblue text-white">KYC Time</th>
                                                            <th className="text-center bgblue text-white">Agent ID</th>
                                                            <th className="text-center bgblue text-white">Agent Email</th>
                                                            <th className="text-center bgblue text-white">AgentName Lastname</th>
                                                            <th className="text-center bgblue text-white">KYC Status</th>
                                                            <th className="text-center bgblue text-white">Consumer Wallet ID</th>
                                                            <th className="text-center bgblue text-white">KYC Respond</th>
                                                            <th className="text-center bgblue text-white">DOPA Respond</th>
                                                            <th className="text-center bgblue text-white">Agent Type</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* {renderTable()} */}
                                                        { loading ? (renderTable()) : (<ReactBootStrap.Spinner animation="border" />) }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <br />
                                        <ReactToExcel className="btn btn-success" table="table-to-xls" filename="eKYCMonthlyReport" sheet="sheet 1"  buttonText="Export" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <ReactBootStrap.Spinner animation="border" /> */}
        </div>
    )
}

export default Ekycmonthlyreport;