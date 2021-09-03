import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, withRouter, useHistory } from 'react-router-dom'
//import Editstatementending from './Editstatementending';

// import 'jquery/dist/jquery.min.js';
// import "datatables.net-dt/js/dataTables.dataTables"
// import "datatables.net-dt/css/jquery.dataTables.min.css"
// import $ from 'jquery';

function  Liststatementending() {
    
    let history = useHistory();

    const EditStatementEnding = (id) => {

        history.push({
            pathname: '/Editstatementending',
            search: '?id='+id,
        });
    }

    const [data, setData] = useState([])

    useEffect(() => {
        // $(document).ready(function () {
        //     $('#example').DataTable();
        // });

        const fetchData = async () => {
            try{
                const responsEndingBalance = await axios.get(`http://localhost:9000/api/v1/reports/allStatementEndingBalance`)
                const { data: endingbalnace } = responsEndingBalance
                const { data } = endingbalnace
                setData(data)
            }catch(err){
                Error(err);
            }
        }
        fetchData();
    }, []);

    const renderTable = () => {
        let i = 0;
        return data.map(endingbalnace => {

            let bankaccount = "";
            i++

            if(endingbalnace.Bank_UID === 2){
                bankaccount = '777-2-38735-5'
            }
            if(endingbalnace.Bank_UID === 4){
                bankaccount = '777-2-38736-0'
            }

            return (
                <tr>
                    <td>{i}</td>
                    <td align="center">
                        {bankaccount}
                    </td>
                    <td align="center">{endingbalnace.Statement_Balance.toLocaleString('en')}</td>
                    <td align="center">
                        {/* {endingbalnace.dateTime.substring(0, 10)} */}
                        {endingbalnace.Statement_Date.substring(0, 10)}
                    </td>
                    <td align="center">
                        <button className="btn btn-primary btn-edit" type="button" onClick={() => {EditStatementEnding(endingbalnace.id)}}><i className="fa fa-edit"> Edit</i></button>
                    </td>
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
                            <h1 className="m-0">EDIT STATEMENT ENDING BALANCE</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body table-responsive p-0" style={{height:'85vh'}}>
                                    <table id="example" className="table table-head-fixed text-nowrap table-hover">
                                        <thead>
                                        <tr>
                                            <th className="bgblue text-white">No</th>
                                            <th className="text-center bgblue text-white">Bank Account</th>
                                            <th className="text-center bgblue text-white">Balance</th>
                                            <th className="text-center bgblue text-white">Date</th>
                                            <th className="text-center bgblue text-white">Edit</th>
                                        </tr>
                                        </thead>
                                        <tbody>{renderTable()}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) 
}

export default Liststatementending;