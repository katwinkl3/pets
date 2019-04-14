import React, { Component, useState, useCallback, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './PetProfile.css';
import {Form, Input, Button, Icon, Row, Col } from 'antd';


// VERY PROBLEMATIC PAGE; NEEDS TO RESOLVE

function getCookie(name) {
  function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
  return match ? match[1] : null;
}

function getPetOwnerProfile(id) {
  if (!id) {
      return;
  }

  return fetch('http://localhost:3001/user/petowner', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
          id
      }),
      credentials: 'include'
  })
}

async function fetchPetOwner(type, id, setError, setPets, params) {
  if (type === "Petowner") {
      try {
        let id;
        if (params.id == null) {
          id = getCookie("userId");
        } else {
          id = params.id;
        }
          let resp = await getPetOwnerProfile(id)
          let data = await resp.json()

          if(data.data && data.data.info) {
              setPets(data.data.info)
          }
      } catch (e) {
          setError(JSON.stringify(e))
      }
  }

}

function PetProfile({ history, match}) {
  const [id, setId] = useState('');
  const [anyErrors, setError] = useState('');
  const [pets, setPets] = useState([]);

  useEffect(() => {
      fetchPetOwner(id, setError,  setPets, match.params)
  }, [id])

      return (
        <div>
        <Button className="pet-profile-button" type="primary">
            <Icon type="left" />Back to owner's profile</Button>
        <Row>
        <Col span={12}>
        <div className = "pet-profile-pic">
        <img className = "pet-profile-img" src="https://upload.wikimedia.org/wikipedia/commons/8/86/Maltese_puppy.jpeg" alt="pet image1"/>
        <img className = "pet-profile-img" src="https://i.pinimg.com/originals/07/ad/bb/07adbb578d159d2bde3eaaf89cbdcf14.jpg" alt="pet image2"/>
        <img className = "pet-profile-img" src="https://irp-cdn.multiscreensite.com/c096e00e/dms3rep/multi/mobile/cute-maltese-dog%20(330%20x%20296)-min-330x296.jpg" alt="pet image3"/>
        </div>
        </Col>

        <Col span={12}>
          <div className="pet-profile">
          <h1 className="pet-profile-subtitle">Pet Name:</h1>
          <h1 className="pet-profile-subtitle">Type:</h1>
          <h1 className="pet-profile-subtitle">Breed:</h1>
          <h1 className="pet-profile-subtitle">Size:</h1>
          <h1 className="pet-profile-subtitle">Gender:</h1>
          <h1 className="pet-profile-subtitle">Age:</h1>
          <h1 className="pet-profile-subtitle">Description:</h1>
          <h1 className="pet-profile-subtitle">Medical Condition/Dietary Requests: </h1>
          </div>
        </Col>
        </Row>
        </div>
  );

}

export default withRouter(PetProfile);
