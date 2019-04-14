import React, { Component } from 'react';
import {Form, Select, Slider, DatePicker, InputNumber, Row, Col, Checkbox, Button, Card, Rate, Pagination} from 'antd';
import AlgoliaPlaces from 'algolia-places-react';
import './SearchForm.css';
import { NavLink , withRouter } from 'react-router-dom';


const Option = Select.Option;
const services = [
  "Pet Boarding", "Washing", "Walking", "Feeding", "Vet Visitation", "Overnight", "Drop In Visits",
  "Pet Day Care"
]
const pettype = [
  "Dog", "Cat", "Hamster", "Rabbit"
]
const petsize = [
  "Small: 0 - 5kg", "Medium: 6 - 15kg", "Large: 16 - 45kg", "Giant: > 45kg"
]
const filters = [
  "None", "Most Popular", "Lowest-Highest Rate"
]

const CheckboxGroup = Checkbox.Group;
const houseOptions = ['Do not have other pets in their house',
                    'Do not cage pets'];
const miscOptions = ['Takes care of one client at a time',
'Pet First-Aid certified'];


class SearchForm extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(Search)
        return (
            <div className="login-container">
                <div className="login-content">
                    <AntWrappedLoginForm  {...this.props}/>
                </div>
            </div>
        );
    }
}


class Search extends Component {
  shouldComponentUpdate(nextProps, nextState) {
   if (this.props.location.pathname == nextProps.location.pathname && JSON.stringify({a: this.state.currentResultsDisplay}) === JSON.stringify({a: nextProps.currentResultsDisplay})) {
     return false;
   } else {
     return true;
   }
 }

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
     marks: {
        0: 10,
        100: 100
      },
      location: {},
      results:[],
      totalResultsDisplay:[],
      currentResultsDisplay: props.currentResultsDisplay,
      current: 1,
      service: 'Pet Boarding',
      pettype: 'Dog',
      petsize: 1,
      numofpet: 1,
      housingopt: 0,
      miscopt: 0,
      startdate: '',
      enddate: '',
      filter: 0
  };
  }

  onPageChange = (page) => {
   let currentResultsDisplay = [];
   for (let i=(page-1)*3; i<page*3; i++) {
      currentResultsDisplay.push(this.state.totalResultsDisplay[i]);
   }
   this.setState({
     current: page,
     currentResultsDisplay: currentResultsDisplay,
   });
   window.scrollTo(0, 0);
   this.myRef.current.scrollTo(0, 0);
 }

  onSelect(value) {
    console.log('onSelect', value);
  }


  handleSubmit(event) {
    let selection = {
      service: this.state.service,
      pettype: this.state.pettype,
      petsize: this.state.petsize,
      numofpet: this.state.numofpet,
      marks: this.state.marks[100],
      housingopt: this.state.housingopt,
      miscopt: this.state.miscopt,
      startdate: this.state.startdate,
      enddate: this.state.enddate,
      filter: this.state.filter
    }
    event.preventDefault();
    console.log(selection);

    // this.makeFakeDataFirst();
    var request = new Request("http://localhost:3001/getCaretakers", {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(selection),
      credentials: 'include'
    });
  let results = []
  fetch(request)
      .then((response) =>
        response.json())
        .then((data) => {
          results = data
          console.log(results)
          this.displayResults(results)
         this.props.onSearchFilter(selection.service,selection.startdate, selection.enddate, this.state.currentResultsDisplay);
        })

      .catch(function(err) {
        console.log(err);
      })
    }

    cardClick = (id) => {
      console.log("hello" + id);
      let url = "/user-profile/" + id;
      this.props.history.push(url);
    }

displayResults = (results) => {
  let totalResultsDisplay = [];
  let currentResultsDisplay = [];
    results.map((result, i, array) =>  {
      console.log("i am here")
      if (i%2===0 && i+1<array.length) {
        totalResultsDisplay.push(
          <Row key={i}>
           <Col span={12}>
             <Card
              hoverable
              className="results-card"
               bordered={false}
               style={{ width: 240 }}
               cover={<img alt="example" src="https://i.pinimg.com/originals/74/6d/ab/746dab017f2d7f3c5da3aa7b1995d706.jpg" />}

              >
             <Card.Meta
               title= {
                 <div>
                   <div className="results-name-div">
                     <span> {array[i].name} </span>
                     <p className="results-location">{"Bishan"}</p>
                   </div>
                   <div className="results-rate-div">
                     <p className="results-from"> from </p>
                     <p className="results-rate"> ${array[i].rate} </p>
                     <p className="results-location"> per day </p>
                   </div>
                 </div>
               }
               />
             </Card>
             </Col>
             <Col span={12}>
             <Card className="results-card"
               hoverable
               bordered={false}
               style={{ width: 240 }}
               cover={<img alt="example" src="https://us.123rf.com/450wm/warrengoldswain/warrengoldswain1603/warrengoldswain160300008/54380987-hipster-man-petting-and-rubbing-his-dog-loving-affection-relationship-bond-between-owner-and-pet.jpg?ver=6" />}>
               onClick={() => this.cardClick(array[i+1].cid)}
               cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
             <Card.Meta
               title= {
                 <div>
                   <div className="results-name-div">
                     <span> {array[i+1].name} </span>
                     <p className="results-location">{"Pasir Ris"}</p>
                   </div>
                   <div className="results-rate-div">
                     <p className="results-from"> from </p>
                     <p className="results-rate"> ${array[i+1].rate} </p>
                     <p className="results-location"> per day </p>
                   </div>
                 </div>
               }
               />
             </Card>
               </Col>
            </Row>
          );
    } else if (i%2===0 && i+1>=array.length) {
        totalResultsDisplay.push(
          <Row key={i}>
           <Col span={12}>
             <Card className="results-card"
               hoverable
               bordered={false}
               style={{ width: 240 }}
               cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
               onClick={() => this.cardClick(array[i].cid)}>
             <Card.Meta
               title= {
                 <div>
                   <div className="results-name-div">
                     <span> {array[i].name} </span>
                     <p className="results-location">{array[i].location}</p>
                   </div>
                   <div className="results-rate-div">
                     <p className="results-from"> from </p>
                     <p className="results-rate"> ${array[i].rate} </p>
                     <p className="results-location"> per day </p>
                   </div>
                 </div>
               }
               />
             </Card>
            </Col>
          </Row>
           );
         }
       }
     );
     for (let i=(this.state.current-1)*3; i<this.state.current*3; i++) {
       console.log(i);
        currentResultsDisplay.push(totalResultsDisplay[i]);
     }

     this.setState({
       results: results,
       totalResultsDisplay: totalResultsDisplay,
       currentResultsDisplay: currentResultsDisplay
     })
  }

  onRateChange(value) {
      let newVal = value;
      this.setState({
        marks: {
          0: 10,
          100: newVal
          }
        })
        console.log(this.state.marks[100]);
    }

  onDateChange(date, dateString) {
    console.log(date);
    console.log(dateString);
    this.state.startdate = dateString[0]
    this.state.enddate = dateString[1]
    console.log(this.state.startdate);
    console.log(this.state.enddate);
  }

  onServiceChange(value) {
    this.state.service = value;
    console.log(this.state.service);
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

  /* onLocationChange(suggestion) {
    console.log(suggestion);
    this.setState({
      location: suggestion
    })
  } */

  onFilterChange(value) {
    if(value === "Most Popular"){
        this.state.filter = 1
     }
        else if(value === "Lowest-Highest Rate"){
         this.state.filter = 2
      }
        else if(value === "None"){
           this.state.filter = 0
        }
          else {
          console.log("No filter selected")
       }
  }


  render() {
    return (
      <div>
      <Row gutter={16}>
       <Col span={8} className="search-filters">
       <div className="inner-filters">
        <h3 className="title-label">Find A Sitter </h3>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div>
          <p className="service-label">Service</p>
          </div>
          <Form.Item>
            <Select
              size="large"
              name="role"
              autoComplete="off"
              style={{ width: '100%', fontSize: '14px' }}
              defaultValue={['Pet Boarding']}
              onChange = {event => this.onServiceChange(event)}>
              {services.map(service => <Option key={service}>{service}</Option>)}
            </Select>
          </Form.Item>
           {/*<div className="slider-label">
            <p>Location</p>
          </div>
          <div className="algolia">
          <AlgoliaPlaces
              placeholder='Address'
              options={{
               appId: 'pl4X3CET64PO',
               apiKey: '810117f3a4fd4815c33232c31f02cf48',
               countries: ['sg']
              }}
              onChange={({ query, rawAnswer, suggestion, suggestionIndex }) => {
               this.onLocationChange(suggestion);
              }}
              onClear={() => {
                this.onLocationChange({});
              }}
              onLimit={({ message }) =>
               console.log('Fired when you reached your current rate limit.')}
            />
         </div> */}
          <div className="slider-label">
            <p>Rate (S$)</p>
          </div>
          <Form.Item>
            <Slider
              marks={this.state.marks}
              defaultValue={100}
              tipFormatter={(value) => `$${value}`}
              onChange={this.onRateChange.bind(this)}/>
          </Form.Item>
          <div className="dates-label">
            <p>Dates</p>
          </div>
          <Form.Item className="date-picker">
             <DatePicker.RangePicker
                style={{ fontSize: '14px' }}
                onChange={this.onDateChange.bind(this)}
                placeholder={['Drop off', 'Pick up']}/>
          </Form.Item>
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
            <p>Number of Pets</p>
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
            <br /><br />
          <Button className= "search-button" type="primary" htmlType="submit" onClick={this.handleSubmit.bind(this)}>
            Search</Button>
            </Form>
            </div>
          </Col>
          <Col span={16}>
            <h3 className="results-label">Results</h3>
            <Form.Item>
              <Select
                className="results-filter"
                size="large"
                name="role"
                autoComplete="off"
                style={{ width: '40%', float: 'right', fontSize: '14px' }}
                defaultValue={['Filter By']}
                onChange = {event => this.onFilterChange(event)}>
                {filters.map(filters => <Option key={filters}>{filters}</Option>)}
              </Select>
            </Form.Item>
            <div className="results" ref={this.myRef}>
              {this.state.currentResultsDisplay}
            </div>
            <Pagination
              current={this.state.current}
              pageSize={6}
              onChange={this.onPageChange.bind(this)}
              total={this.state.results.length} />
          </Col>
          </Row>
      </div>
    );
  }
}


export default withRouter(SearchForm);
