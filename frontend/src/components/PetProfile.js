import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './PetProfile.css';
import {Form, Input, Button, Icon, Row, Col } from 'antd';



function PetProfile({history, location}){
      return (
        <div>
        <Button className="pet-profile-button" type="primary" onClick={() => history.push("/my-user-profile")}>
            <Icon type="left" />Back to owner's profile</Button>
        <Row>
        <Col span={12}>
        <div className = "pet-profile-pic">
        <img className = "pet-profile-img" src={location.state.im1} alt="pet image1"/>
        <img className = "pet-profile-img" src={location.state.im2} alt="pet image2"/>
        <img className = "pet-profile-img" src={location.state.im3} alt="pet image3"/>
        </div>
        </Col>
        <Col span={12}>
          <div className="pet-profile">
          <h1 className="pet-profile-subtitle"><b>Name:</b> {location.state.name}</h1>
          <h1 className="pet-profile-subtitle"><b>Type:</b> {location.state.type}</h1>
          <h1 className="pet-profile-subtitle"><b>Weight:</b> {location.state.weight}</h1>
          <h1 className="pet-profile-subtitle"><b>Breed:</b> {location.state.breed}</h1>
          <h1 className="pet-profile-subtitle"><b>Gender:</b> {location.state.gender}</h1>
          <h1 className="pet-profile-subtitle"><b>Age:</b> {location.state.age}</h1>
          <h1 className="pet-profile-subtitle"><b>Description:</b> {location.state.description}</h1>
          <h1 className="pet-profile-subtitle"><b>Medical Condition/Dietary Requests:</b> {location.state.med}</h1>
          </div>
        </Col>
        </Row>
        </div>
  );
}
export default withRouter(PetProfile);