import React, { Component } from 'react';
import {Form, Input, Select, Button, message, DatePicker, InputNumber, Checkbox} from 'antd';
import './Signup.css';
import { withRouter } from "react-router";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;


const services = [
  "Pet Boarding", "Washing", "Walking", "Feeding", "Vet Visitation", "Overnight", "Drop In Visits",
  "Pet Day Care"
];

class AddServiceInEditProfile extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit = (id) => {
    this.props.onGoToAddPet(id);
  }

  render() {
        const AntWrappedLoginForm = Form.create()(AddServiceForm)
        return (
          <div>
            <AntWrappedLoginForm {...this.props} />
          </div>
        );
    }
}



class AddServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: '',
      service: 'Pet Boarding',
      pettype: 'Dog',
      petsize: 1,
      numofpet: 1,
      housingopt: 0,
      miscopt: 0,
    }
  }
  validateFields = () => {
    let validated = false;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        validated = true;
      }
    });
    return validated;
  }

   onSubmit = (event)  => {
       event.preventDefault();
       if (this.validateFields()) {
         let data = this.props.form.getFieldsValue();
         data  = Object.assign({}, data, { date: this.state.dateString});
         console.log(data);
         var request = new Request("http://localhost:3001/addService", {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(data),
            credentials: 'include',
          });

          fetch(request)
          .then((response) => {
            if (!response.ok) {
              message.error('An error occurred. Please try again.');
            } else {
              this.props.history.push("/");
            }
           })
          .catch(function(err) {
            console.log(err);
          })
        }
    }

    onDateChange(date, dateString) {
      this.setState({
        dateString: dateString,
      });
      this.props.form.setFieldsValue({
         date: dateString
       });
    }

    onServiceChange(value, options) {
      this.props.form.setFieldsValue({
         service: value
       });
    }


    onRateChange (value) {
      this.props.form.setFieldsValue({
         rate: value
       });
    }

  render() {
    const { getFieldDecorator } = this.props.form;

    return(
      <div>
        <h1 className = "signup-title"> Add Your Service </h1>
        <div className="signup-div">
          <div>
          <p className="service-label">Service</p>
          </div>
          <Form>
        <Form.Item>
        {getFieldDecorator('service', {
            initialValue: ["Pet Boarding"],
            rules: [{
              required: true,
            }],
          })(
          <Select
            size="large"
            name="role"
            autoComplete="off"
            style={{ width: '100%', fontSize: '14px' }}
            onChange = {event => this.onServiceChange(event)}>
            {services.map(service => <Option key={service}>{service}</Option>)}
          </Select>
        )}
        </Form.Item>
        <div className="dates-label">
          <p>Dates Available</p>
        </div>
        <Form.Item className="date-picker">
        {getFieldDecorator('date', {
            rules: [{
              required: true,
            }],
          })(
           <DatePicker.RangePicker
              style={{ fontSize: '14px' }}
              onChange={this.onDateChange.bind(this)}
              placeholder={['Start Date', 'End Date']}/>
          )}
        </Form.Item>
        <div className="slider-label">
          <p>Charge/day</p>
        </div>
        <Form.Item>
        {getFieldDecorator('rate', {
            initialValue: 10,
            rules: [{
              required: true,
            }],
          })(
        <InputNumber
            min={10}
            max={150}
            style={{ width: '100%', marginBottom: '25px', fontSize: '14px' }}
            formatter={value => `$${value}`}
            onChange={event => this.onRateChange.bind(this)} />
          )}
          </Form.Item>
        <Button className= "login-button" type="primary" htmlType="submit" onClick={this.onSubmit.bind(this)}>
            Done
        </Button>
        </Form>
        </div>
        </div>
      );
    }
}

export default withRouter(AddServiceInEditProfile);
