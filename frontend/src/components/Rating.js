import React, { Component } from 'react';
import { Table, Divider, Tag, Input, Button, Popconfirm, Form, Rate, Icon } from 'antd';
import './BidTracker.css';
import { withRouter } from "react-router";

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      historyid: ''
    }
  }

  onRateChange = (value) => {
    this.state.value = value
    console.log(this.state.value);
  }

  onSubmit = () => {
    this.getHistoryID();
    let data = {
      value: this.state.value,
      historyid: this.state.historyid
    }
    console.log(data)
    var request = new Request("http://localhost:3001/addReview", {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(data),
      credentials: 'include'
    });

    fetch(request)
    .then((response) => {
      console.log(request)
      response.json()
      .then((data) => {
        console.log(data)
      })
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  getHistoryID = () => {
      console.log(this.props.location.pathname)
      var numberPattern = /\d+/g;
      this.state.historyid = this.props.location.pathname.match(numberPattern)[0]
      console.log(this.state.historyid)
  }



  render() {
  return (
    <div className="rating">
    <Button href="/bid-tracker" className="bid-tracker-button" type="primary">
        <Icon type="left" />Back to bids</Button>
    <h1 className = "rate-title">Rate the Service</h1>
    <h2 className = "rate-subtitle">How was the overall experience?</h2>
    <div className = "rate">
    <Rate onChange={this.onRateChange}/>
    </div>
    <Button className="rate-button" type="primary" onClick={this.onSubmit}> Submit
    </Button>
    </div>
  );
}}

export default withRouter(Rating);
