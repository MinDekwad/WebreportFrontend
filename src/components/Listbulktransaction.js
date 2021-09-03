import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link, withRouter, useHistory } from 'react-router-dom'


function  Listbulktransaction() {

    let history = useHistory();
    const EditBulktransaction = (id) => {

        history.push({
            pathname: '/Editbulktransaction',
            search: '?id='+id,
        });
    }
    const [data, setData] = useState([])

    useEffect(() => {

        const fetchData = async () => {
            try{
                const responsBulkTransaction = await axios.get(`http://localhost:9000/api/v1/reports/allBulkTransaction`)
                const { data: bulktransaction } = responsBulkTransaction
                const { data } = bulktransaction
                setData(data)
            }catch(err){
                Error(err);
            }
        }
        fetchData();
    },[]);

    const renderTable = () => {
        let i = 0;
        return data.map(bulktransaction => {
            i++
            return (
                <tr>
                    <td>{i}</td>
                    <td align="center">{bulktransaction.dateTime.substring(0, 10)}</td>
                    <td align="center">{bulktransaction.bulkCreditSameday.toLocaleString('en')}</td>
                    <td align="center">{bulktransaction.bulkCreditSamedayFee.toLocaleString('en')}</td>
                    <td align="center">{bulktransaction.transfertobankaccount.toLocaleString('en')}</td>
                    <td align="center">
                        <button className="btn btn-primary btn-edit" type="button" onClick={() => {EditBulktransaction(bulktransaction.id)}}><i className="fa fa-edit"> Edit</i></button>
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
                            <h1 className="m-0">EDIT BULK TRANSACTION</h1>
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
                                            <th className="text-center bgblue text-white">Date</th>
                                            <th className="text-center bgblue text-white">Bulk credit same day</th>
                                            <th className="text-center bgblue text-white">Bulk credit same day fee</th>
                                            <th className="text-center bgblue text-white">Transfer to bank account</th>
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
export default Listbulktransaction;