import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Admin.css';
import { Table, Divider, Tag, Input, Button, Popconfirm, Form } from 'antd';

const { Column, ColumnGroup } = Table;


class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      losscaretakers: [],
      allupcomingbids: [],
    }
  }
  componentWillMount () {
      var losscaretakers = new Request("http://localhost:3001/getLossCaretakers", {
        method: 'GET',
        headers: new Headers({'Content-Type': 'application/json'}),
      });
      var upcomingbidrequest = new Request("http://localhost:3001/getUpcomingBids", {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        credentials: 'include'
      });
      fetch(losscaretakers)
          .then((response) =>
            response.json())
            .then((data) => {
              this.setState({
                losscaretakers: data
              })
              console.log(this.state.losscaretakers)
            })
          .catch(function(err) {
            console.log(err);
          })
        fetch(upcomingbidrequest)
            .then((response) =>
              response.json())
              .then((upcomingbiddata) => {
                this.setState({
                  allupcomingbids: upcomingbiddata
                })
              })
            .catch(function(err) {
              console.log(err);
            })
          }

          handleDelete = (key) => {
            this.setState({
              deletebid: key
            })
            console.log(key);
            console.log(this.state.deletebid);
            this.nextDelete();
          }

          nextDelete = () => {
            let data = {
              deletebid: this.state.deletebid,
            }
            var request = new Request("http://localhost:3001/deleteBid", {
              method: 'DELETE',
              headers: new Headers({'Content-Type': 'application/json'}),
              body: JSON.stringify(data)
            });

            fetch(request)
            .then((response) => {
              console.log(request)
              response.json()
              .then((data) => {
                console.log(data)
                this.updateBidTable();
              })
            })
            .catch(function(err) {
              console.log(err);
            })
          }

          updateBidTable () {
              var losscaretakers = new Request("http://localhost:3001/getLossCaretakers", {
                method: 'GET',
                headers: new Headers({'Content-Type': 'application/json'}),
              });
              var upcomingbidrequest = new Request("http://localhost:3001/getUpcomingBids", {
                method: 'POST',
                headers: new Headers({'Content-Type': 'application/json'}),
                credentials: 'include'
              });
              fetch(losscaretakers)
                  .then((response) =>
                    response.json())
                    .then((data) => {
                      this.setState({
                        losscaretakers: data
                      })
                      console.log(this.state.losscaretakers)
                    })
                  .catch(function(err) {
                    console.log(err);
                  })
                fetch(upcomingbidrequest)
                    .then((response) =>
                      response.json())
                      .then((upcomingbiddata) => {
                        this.setState({
                          allupcomingbids: upcomingbiddata
                        })
                      })
                    .catch(function(err) {
                      console.log(err);
                    })
                  }
  render() {
      return (
        <div>
        <h1 className="admin-title">List of caretakers who are making a loss for all their services</h1>
        <Table dataSource={this.state.losscaretakers}>
        <Column
          title="Caretaker ID"
          dataIndex="caretakerid"
          key="caretakerid"
        />
        <Column
          title="Caretaker Name"
          dataIndex="name"
          key="name"
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <span>
              <a href={"mailto:" + record.email}>Alert</a>
            </span>
          )}
        />
        </Table>
        <h1 className="admin-title">List of all bids</h1>
        <Table dataSource={this.state.allupcomingbids}>
        <Column
          title="Bid Date"
          dataIndex="bidtimestamp"
          key="bidtimestamp"
        />
        <Column
          title="Pet Owner"
          dataIndex="owner_name"
          key="owner_name"
        />
        <Column
          title="Pet Name"
          dataIndex="name"
          key="name"
        />
        <Column
        title="Type"
        dataIndex="pettype"
        key="pettype"
        />
        <Column
        title="Breed"
        dataIndex="breed"
        key="breed"
        />
        <Column
        title="Service"
        dataIndex="service"
        key="service"
        />
        <Column
        title="Start Date"
        dataIndex="servicestartdate"
        key="servicestartdate"
        />
        <Column
        title="End Date"
        dataIndex="serviceenddate"
        key="serviceenddate"
        />
        {/*<Column
        title="Address"
        dataIndex="address"
        key="address"
        />*/}

        <Column
        title="Action"
        key="action"
        render={(text, record) => (
          <span>
          <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.bidid)}>
            <a href="javascript:;">Remove</a>
          </Popconfirm>
          </span>

        )}
        />
        </Table>
        </div>
  );

}}

export default withRouter(Admin);
