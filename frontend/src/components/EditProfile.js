import React, { useState, useCallback, useEffect } from 'react';
import { withRouter } from "react-router";
import { message, Button, Input } from 'antd';

import './UserProfile.css';

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

function changeDetails(changedName, changedDesc, id){
    return fetch('http://localhost:3001/change_details',{
        headers: { 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            changedName, changedDesc, id
        })
    })
}

async function fetchChangedDetails(changedName, changedDesc, id, setError){
    try{
        let resp = await changeDetails(changedName, changedDesc, id)
        let data = await resp.json()
    } catch(e) {setError(JSON.stringify(e))}
}

function deleteService(serviceName, id, startDate, endDate){
    return fetch('http://localhost:3001/delete_pets', {
        headers: { 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            serviceName, id, startDate, endDate
        })
    })
}

function deletePet(petName, id){
    return fetch('http://localhost:3001/delete_pets', {
        headers: { 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            petName, id
        })
    })
}

function EditProfile({ history, match,}) {
    const [name, setName] = useState('');
    const [changedName, setChangedName] = useState('');
    const [type, setType] = useState('');
    const [id, setId] = useState('');
    const [desc, setDesc] = useState('');
    const [changedDesc, setChangedDesc] = useState('');
    const [img, setImg] = useState('');
    const [anyErrors, setError] = useState('');
    const [pets, setPets] = useState([]);
    const [services, setServices] = useState([]);
    const [pageEmail, setPageEmail] = useState([]);
    const email = localStorage.getItem("email");
    const [petName, setPetName] = useState([]);
    const [serviceName, setServiceName] = useState([]);
    const [startDate, setStartDate] = useState([]);
    const [endDate, setEndDate] = useState([]);
    const popup =  useState();

    const nameChanged = useCallback((e) => {
        setChangedName(e.target.value);
    }, [])

    const descChanged = useCallback((e) => {
        setChangedDesc(e.target.value);
    }, [])

    const submit = useCallback(async (e) =>{
        try {
            fetchChangedDetails(changedName, changedDesc, id)
        } catch(e){
            setError("unexpected error")
        }
    })


    const deleteSelectedService = useCallback(async (e) => {
        try {
            let resp = await deleteService(serviceName, id, startDate, endDate)
            let data = await resp.json()
            if (data.status === 'failed') message.warning(data.message);
            else message.success("Successfully Deleted");
        } catch(e){
            message.warning(e)
        }
    })

    const deleteSelectedPet = useCallback(async (e) => {
        try {
            let resp = await deletePet(petName, id)
            let data = await resp.json()
            console.log(data.status+" ");
            console.log(data.message);
            if (data.status === 'failed') message.warning(data.message);
            else message.success("Successfully Deleted");
        } catch(e){
            message.warning(e)
        }
    })

    useEffect(() => {
        fetchUserProfile(setName, setType, setId, setDesc, setImg, setPageEmail, setError, match.params)
    }, [email])

    useEffect(() => {
        fetchPetOwner(type, id, setError,  setPets)
    }, [type, id])

    useEffect(() => {
        fetchCareTaker(type, id, setError,  setServices)
    }, [type, id])

    console.log(img)

    return (
        <html>
            <section class="intro-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-1 col-lg-2"></div>
                        <div class="col-md-10 col-lg-8">
                            <div class="intro">
                                <div class="profile-img"><img src={img} alt="" /></div>
                                <h2 class="profile-name"><b>Name</b></h2>
                                <Input
                                    style={{ width: 200 }}
                                    placeholder={name}
                                    onChange={nameChanged}
                                />
                                <h3 class="profile-desc"><b>Description</b></h3>
                                <Input
                                    style={{ width: 200 }}
                                    placeholder={desc}
                                    onChange={descChanged}
                                />
                            </div>
                            <div class="intro">
                                <Button className="email-button" onClick={submit}> Submit </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            }

            {/* Webpage for Caretakers */}
            {(type === "Caretaker") &&
                <section class="portfolio-section section">
                <div class="portfolioContainer  margin-b-50">
                <h1 className="petowner-pets">{name}'s Services & Available Dates</h1>
                
                <Button className="email-button" onClick={() => history.push('/add-service')}> Add more services </Button>
                    {
                        services.map(i => {
                            return (
                                // Could be good to group by service and within the own website, differentiate by time instead of the current format
                                <div class="p-item web-design">
                                <p><b>{i['service']}</b></p>
                                <p>Start Day/Time: {i['startdate'].slice(0, 10) + ' ' + i['startdate'].slice(11,16)}</p>
                                <p>End Day/Time: {i['enddate'].slice(0, 10) + ' ' + i['enddate'].slice(11,16)}</p>
                                <Button onClick={() => deleteSelectedService(i['service'], id, i['startdate'], i['enddate'])}> Delete {i['service']} </Button>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            }

            {/* Webpage for PetOwners */}
            {(type === "Petowner") &&
                <section class="portfolio-section section">
                    <div class="portfolioContainer  margin-b-50">
                    <h1 className="petowner-pets">{name}'s pets</h1>
                    <Button className="email-button" onClick={() => history.push('/add-pet')}> Add more pets </Button>
                        {
                            pets.map(i => {
                                return (
                                    <div class="p-item web-design">
                                    <p>Pet Name: {i['name']}</p>
                                    <img src={i['image1']} alt="" />
                                    <Button onClick={() => deleteSelectedPet(i['name'], id)}> Delete - {i['name']} </Button>
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


export default withRouter(EditProfile);