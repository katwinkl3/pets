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

const pettype = [
  "Dog", "Cat", "Hamster", "Rabbit"
]
const petsize = [
  "Small: 0 - 5kg", "Medium: 6 - 15kg", "Large: 16 - 45kg", "Giant: > 45kg"
]
const houseOptions = ['I do not have other pets in my house',
                    'I do not cage pets'];
const miscOptions = ['I take care of one client at a time',
'I am pet first-aid certified'];



class AddService extends Component {
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
         let selection = {
           pettype: this.state.pettype,
           petsize: this.state.petsize,
           numofpet: this.state.numofpet,
           housingopt: this.state.housingopt,
           miscopt: this.state.miscopt,
         }
         data  = Object.assign({}, data, { date: this.state.dateString}, selection);
         console.log(data);
         var request = new Request("http://localhost:3001/addCaretakerPrefsAndServices", {
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

    onPetTypeChange(value) {
      this.state.pettype = value;
      console.log(this.state.pettype);
    }

    onPetSizeChange(value) {
      if(value === "Small: 0 - 5kg"){
          this.state.petsize = 1
       } else if(value === "Medium: 6 - 15kg"){
           this.state.petsize = 2
      } else if(value === "Large: 16 - 45kg"){
          this.state.petsize = 3
     } else if(value === "Giant: > 45kg"){
         this.state.petsize = 4
       } else {
         console.log("error! does not fall into any weight groups")
    }
    }

    onPetNoChange(value) {
      this.state.numofpet = value;
      console.log(this.state.numofpet);
    }

    onHousingChange(checkedValues) {
      console.log(checkedValues)
      if(checkedValues.length === 0){
          this.state.housingopt = 0
       } else if(checkedValues.length === 1 && checkedValues[0] === "Do not have other pets in their house"){
           this.state.housingopt = 1
      } else if(checkedValues.length === 1 && checkedValues[0] === "Do not cage pets"){
          this.state.housingopt = 2
     } else if(checkedValues.length === 2){
         this.state.housingopt = 3
       } else {
         console.log("error! does not fall into any housing option groups")
       }
    }

    onMiscChange(checkedValues) {
      console.log(checkedValues)
      if(checkedValues.length === 0){
          this.state.miscopt = 0
       } else if(checkedValues.length === 1 && checkedValues[0] === "Takes care of one client at a time"){
           this.state.miscopt = 1
      } else if(checkedValues.length === 1 && checkedValues[0] === "Pet First-Aid certified"){
          this.state.miscopt = 2
     } else if(checkedValues.length === 2){
         this.state.miscopt = 3
       } else {
         console.log("error! does not fall into any housing option groups")
       }
    }



render() {
  const { getFieldDecorator } = this.props.form;

  return(
    <div>
    <Form>
    <h1 className = "signup-title"> Add Your Preferences </h1>
      <div className="signup-div">
      <div className="slider-label">
        <p>Pet Type</p>
      </div>
    <Form.Item>
      <Select
        size="large"
        name="role"
        autoComplete="off"
        style={{ width: '100%', fontSize: '14px'  }}
        defaultValue={['Dog']}
        onChange = {event => this.onPetTypeChange(event)}>
        {pettype.map(pettype => <Option key={pettype}>{pettype}</Option>)}
      </Select>
    </Form.Item>
    <div className="slider-label">
      <p>Pet Size</p>
    </div>
    <Form.Item>
      <Select
        size="large"
        name="role"
        autoComplete="off"
        style={{ width: '100%', fontSize: '14px' }}
        defaultValue={['Small: 0 - 5kg']}
        onChange={event => this.onPetSizeChange(event)}>
        {petsize.map(petsize => <Option key={petsize}>{petsize}</Option>)}
      </Select>
    </Form.Item>
    <div className="slider-label">
      <p>Number of Pets At A Time</p>
    </div>
    <InputNumber
        min={1}
        max={10}
        defaultValue={1}
        style={{ width: '100%', marginBottom: '25px', fontSize: '14px' }}
        onChange={event => this.onPetNoChange(event)} />
    <div className="slider-label">
      <p>Housing</p>
    </div>
    <CheckboxGroup
      options={houseOptions}
      onChange={event => this.onHousingChange(event)} />
      <br /><br />
    <div className="slider-label">
      <p>Miscellaneous</p>
    </div>
    <CheckboxGroup
      options={miscOptions}
      onChange={event => this.onMiscChange(event)} />
      </div>
    <h1 className = "signup-title"> Add Your Service </h1>
      <div className="signup-div">
    <div>
    <p className="service-label">Service</p>
    </div>
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
    </div>
    </Form>
    </div>
  );
}
}

export default withRouter(AddService);
