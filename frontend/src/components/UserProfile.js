import React, { useState, useCallback, useEffect } from 'react';
import { withRouter } from "react-router";
import { Route, NavLink } from 'react-router-dom';
import './UserProfile.css';
import PetProfile from './PetProfile';
import { Card } from 'antd';
const { Meta } = Card;

function getUserProfile(id) {
    return fetch('http://localhost:3001/user/profile', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            id
        }),
        credentials: 'include'
    })
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

function getCareTakerProfile(id) {
    if (!id) {
        return;
    }

    return fetch('http://localhost:3001/user/caretaker', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            id
        }),
        credentials: 'include'
    })
}

function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

async function fetchUserProfile(setName, setType, setId, setDesc, setImg, setPageEmail, setError, params) {
    try {
        let id;
        if (params.id == null) {
          id = getCookie("userId");
        } else {
          id = params.id;
        }
        let resp = await getUserProfile(id)
        let result = await resp.json()

        if (result.status === "success") {
            setName(result.data.name)
            setType(result.data.type)
            setId(result.data.id)
            setDesc(result.data.desc)
            setImg(result.data.img)
            setPageEmail(result.data.pageEmail)
        }
    } catch (e) {
        console.error(e)
        setError(e)
    }
}


async function fetchPetOwner(type, id, setError, setPets) {
    if (type === "Petowner") {
        try {
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

async function fetchCareTaker(type, id, setError, setServices) {
    if (type === "Caretaker") {
        try {
            let resp = await getCareTakerProfile(id)
            let data = await resp.json()

            if(data.data && data.data.info) {
                setServices(data.data.info)
            }
        } catch (e) {
            setError(JSON.stringify(e))
        }
    }

}

// const goToAddBid = () => {
//   console.log("yes")
// }

function UserProfile({ history, match, goToAddBid}) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [id, setId] = useState('');
    const [desc, setDesc] = useState('');
    const [img, setImg] = useState('');
    const [anyErrors, setError] = useState('');
    const [pets, setPets] = useState([]);
    const [services, setServices] = useState([]);
    const [pageEmail, setPageEmail] = useState([]);
    const email = localStorage.getItem("email");



    useEffect(() => {
        fetchUserProfile(setName, setType, setId, setDesc, setImg, setPageEmail, setError, match.params)
    }, [email])

    useEffect(() => {
        fetchPetOwner(type, id, setError,  setPets)
    }, [type, id])

    useEffect(() => {
        fetchCareTaker(type, id, setError,  setServices)
    }, [type, id])

    return (
        <html>
            <section class="intro-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-1 col-lg-2"></div>
                        <div class="col-md-10 col-lg-8">
                            <div class="intro">
                                <div class="profile-img"><img src={img} alt="" /></div>
                                <h2 class="profile-name"><b>{name}</b></h2>
                                <h4 class="font-yellow">{type}</h4>
                                <h4 class="profile-desc">{desc}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Own page option - Edit my own profile */}
            {(pageEmail === email) && 
            <section class="buttons-section">
                <div class="container">
                    <button className="email-button" onClick={() => history.push('/edit_profile')}>Edit My Profile</button>
                </div>
            </section>
            }

            {/* Webpage for Caretakers - Email option available if not the user themselves*/}
            {(type === "Caretaker") && (pageEmail != email) &&
            <section class="buttons-section">
                <div class="container">
                  <div>
                    <button className="email-button"><a className="email-link"href={"mailto:" + email}>Contact {name}</a></button>
                    {/* TODO: Need to link button add-bid */}
                    <button className="email-button" onClick={() => history.push('/edit_profile')}>Make A Bid</button>
                  </div>
                </div>
            </section>
              }


            {/* Webpage for Caretakers */}
            {(type === "Caretaker") &&
                <section class="portfolio-section section">
                <div class="portfolioContainer  margin-b-50">
                <h1 className="petowner-pets">{name}'s Services & Available Dates</h1>
                {/* Edit service if own profile page */}
                    {
                        services.map(i => {
                            return (
                                // Could be good to group by service and within the own website, differentiate by time instead of the current format
                                <div class="p-item web-design">
                                <p>Service: {i['service']}</p>
                                <p>Start Day/Time: {i['startdate'].slice(0, 10) + ' ' + i['startdate'].slice(11,16)}</p>
                                <p>End Day/Time: {i['enddate'].slice(0, 10) + ' ' + i['enddate'].slice(11,16)}</p>
                                <p>Service Rate: ${i['rate']}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            }

            {/* Webpage for PetOwners  - Email option if not the own user*/}
            {(type === "Petowner") && (pageEmail != email) &&
            <section class="buttons-section">
                <div class="container">
                <div>
                <button className="email-button"><a className="email-link"href={"mailto:" + email}>Contact {name}</a></button>
                </div>
                </div>
            </section>
            }

            {/* Webpage for PetOwners */}
            {(type === "Petowner") &&
                <section class="portfolio-section section">
                    <div class="portfolioContainer  margin-b-50">
                    <h1 className="petowner-pets">{name}'s pets</h1>
                    {/* Edit Pets Option if Own Profile */}
                        {
                            pets.map(i => {
                                return (
                                    <div class="p-item web-design">

                                        {/* Links to pet page */}
                                        <Card
                                            hoverable
                                            cover={<img src={i['image1']} alt="" />}
                                            onClick={() => history.push({pathname:'/pet-profile', 
                                            state:{userid:id, name: i['name'], weight: i['weight'], age:i['age'],
                                            breed: i['breed'], type: i['pettype'], gender: i['gender'], description: i['description'],
                                            med: i['medical_conditions'], im1: i['image1'], im2: i['image2'], im3: i['image3']}})}>
                                            <Meta 
                                            title = {i['name']}
                                            description = {i['age'] + " years old " + i['breed']}
                                            />
                                        </Card>
                                    </div>
                                )
                            })
                        }
                    </div>
                </section>
            }
        </html>
    );
}


export default withRouter(UserProfile);