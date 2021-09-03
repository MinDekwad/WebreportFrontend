import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
 
import "react-datepicker/dist/react-datepicker.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';

class BootstrapDate1 extends Component {

  constructor (props) {
    super(props)
    this.state = {
      startDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    })
  }

  onFormSubmit(e) {
    e.preventDefault();
    //console.log(this.state.startDate)
    let dateVal = new Date(this.state.startDate);
    let date = dateVal.getFullYear() + "-"+("0" + (dateVal.getMonth() + 1)).slice(-2)+"-"+("0" + (dateVal.getDate())).slice(-2)
    //console.log(date)
    //console.log(e.target.elements.dateHidden.value);

    //axios.get(`https://jsonplaceholder.typicode.com/users`)/api/v1/reports/:slug
    axios.get(`http://localhost:9000/api/v1/reports/introduction?date=${date}`)
    .then(res => {
      //const persons = res.data;
      //this.setState({ persons });
      const data =  res.data.data
      console.log(data);
    })
  }
 
  render() {

    const calendar = {
      position: "absolute",
      right : "20px",
      paddingTop: '10px',
    };

    return (
      <form onSubmit={ this.onFormSubmit }>
        <div className="form-group">
          
          <div className="input-group-prepend">

          <DatePicker
              selected={ this.state.startDate }
              onChange={ this.handleChange }
              name="startDate"
              dateFormat="dd/MM/yyyy"
              className="DateDailySummaryReport form-control"
              placeholderText="Click for select date"
              id="IDDateDailySummaryReport"
          />
          {/* <button className="btn btn-primary">Show Date</button> */}
          {/* <i className="fa fa-calendar" aria-hidden="true" style={calendar}></i> */}
          <span class="input-group-text spanDateDailySummaryReport"><i class="far fa-calendar-alt"></i></span>
          {/* <button className="btn btn-primary">Show Date</button> */}
          <input type="hidden" value={this.state.userInput} id="dateHidden" />
          <button className="btn btn-success" >Search</button>
          </div>
        </div>
      </form>
    );
  }
  
}

export default BootstrapDate1;