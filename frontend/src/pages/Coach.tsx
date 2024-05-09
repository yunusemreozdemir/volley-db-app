import { useNavigate, Navigate} from 'react-router-dom'
import { useAuth } from '../hooks'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import React, { useState } from 'react';
import axios from 'axios';

import {Input} from '@/components/ui/input'

export default function Coach () {
    const navigate = useNavigate()
    const { logout, checkAuth, getAuth } = useAuth()
    const isAuth = checkAuth()

    if (!isAuth) return <Navigate to="/" />

    const user = getAuth()

    const [activeTab, setActiveTab] = React.useState('addMatchSession')

    const [addTabState, setAddTabState] = React.useState({stadiumName: "", stadiumCountry: "", date: "", timeSlot: "", juryName: "", jurySurname: ""})
    const [deleteTabState, setDeleteTabState] = React.useState('')
    const [createTabState, setCreateTabState] = React.useState({ usernames: [], inputValue: ""})
    const [viewTabState, setViewTabState] = React.useState([])
 

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className='flex-initial flex flex-row justify-between bg-zinc-900 text-white py-3 px-5'>
                <h1 className='text-xl'>Coach</h1>
                <div className='flex flex-row bg-zinc-300 p-1 text-base gap-1 rounded-sm text-zinc-800'>
                    <button className={activeTab === "addMatchSession" ? "bg-white rounded-sm px-4" : "px-4"} onClick={() => setActiveTab('addMatchSession')}>Add Match Session</button>
                    <button className={activeTab === "deleteMatchSession" ? "bg-white rounded-sm px-4" : "px-4"} onClick={() => setActiveTab('deleteMatchSession')}>Delete Match Session</button>
                    <button className={activeTab === "createSquad" ? "bg-white rounded-sm px-4" : "px-4"} onClick={() => setActiveTab('createSquad')}>Create Squad</button>
                    <button className={activeTab === "viewStadiums" ? "bg-white rounded-sm px-4" : "px-4"} onClick={() => {
                        setActiveTab('viewStadiums'); 
                        axios.get(`http://localhost:8000/api/get-stadiums/`)
                            .then(function (response) {
                                console.log(response.data.stadiums);
                                setViewTabState(response.data.stadiums);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }}>View Stadiums</button>
                </div>
                <button onClick={() => {logout(); navigate('/')}}><LogoutOutlinedIcon className='text-2xl'/></button>
            </div>
            <div className='h-full w-full flex-auto flex justify-center'>
                <div className='flex flex-col justify-center'>
                    <div className='shadow-sm rounded-md border p-7'>
                        {
                            activeTab === 'addMatchSession' && (
                                <div>
                                    <Input placeholder='Stadium Name' className='border' value={addTabState.stadiumName} onChange={(e) => setAddTabState((prev) => {return { ...prev, stadiumName: e.target.value}})}/>
                                    <Input placeholder='Stadium Country' className='border' value={addTabState.stadiumCountry} onChange={(e) => setAddTabState((prev) => {return { ...prev, stadiumCountry: e.target.value}})}/>
                                    <Input placeholder='Date' className='border' value={addTabState.date} onChange={(e) => setAddTabState((prev) => {return { ...prev, date: e.target.value}})}/>
                                    <Input placeholder='Time Slot' className='border' value={addTabState.timeSlot} onChange={(e) => setAddTabState((prev) => {return { ...prev, timeSlot: e.target.value}})}/>
                                    <Input placeholder='Jury Name' className='border' value={addTabState.juryName} onChange={(e) => setAddTabState((prev) => {return { ...prev, juryName: e.target.value}})}/>
                                    <Input placeholder='Jury Surname' className='border' value={addTabState.jurySurname} onChange={(e) => setAddTabState((prev) => {return { ...prev, jurySurname: e.target.value}})}/>
                                    <button onClick={() => {
                                        axios.post(`http://localhost:8000/api/add-match-session/`, {
                                            "coach_username": user.user[0],
                                            "stadium_name": addTabState.stadiumName,
                                            "stadium_country": addTabState.stadiumCountry,
                                            "date": addTabState.date,
                                            "time_slot": addTabState.timeSlot,
                                            "jury_name": addTabState.juryName,
                                            "jury_surname": addTabState.jurySurname
                                        
                                        })
                                        .then(function (response) {
                                            setAddTabState({stadiumName: "", stadiumCountry: "", date: "", timeSlot: "", juryName: "", jurySurname: ""});
                                        })
                                        .catch(function (error) {
                                          console.log(error);
                                        }); 
                                    }}>Add</button>
                                </div>
                            )
                        }
                        {
                            activeTab === 'deleteMatchSession' && (
                                <div>
                                    <Input placeholder='Session ID' className='' value={deleteTabState} onChange={(e) => setDeleteTabState(e.target.value)}/>
                                    <button onClick={() => {
                                        axios.post(`http://localhost:8000/api/delete-match-session/`, {"session_ID": deleteTabState})
                                        .then(function (response) {
                                            setDeleteTabState('');
                                        })
                                        .catch(function (error) {
                                          console.log(error);
                                        }); 
                                    }}>Delete</button>
                                </div>
                            )
                        }
                        {
                            activeTab === 'createSquad' && (
                                <div>
                                    <div className="flex flex-col">
                                    <Input className="border" placeholder='Session ID'/>
                                    <Input className="border" placeholder="Enter play usernames" value={createTabState.inputValue} onKeyDown={
                                        (event: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (event.key === 'Enter') {
                                                setCreateTabState((prev) => {return { usernames: [...prev.usernames, prev.inputValue], inputValue: ''}})
                                            }
                                        }
                                    } onChange={(e) => setCreateTabState((prev) => {return { ...prev, inputValue: e.target.value}})} />
                                    </div>
                                    <ul>
                                        {createTabState.usernames.map((username) => (
                                            <li key={username}>{username}</li>
                                        ))}
                                    </ul>
                                    <button onClick={() => {
                                        axios.post(`http://localhost:8000/api/create-squad/`, {"session_ID": deleteTabState})
                                        .then(function (response) {
                                            setDeleteTabState({ usernames: [], inputValue: ""});
                                        })
                                        .catch(function (error) {
                                          console.log(error);
                                        }); 
                                    }}>Create</button>
                                </div>
                            )
                        }
                        {
                            activeTab === 'viewStadiums' && (
                                <div>
                                    <ul>
                                        {viewTabState.map((stadium) => (
                                            <li key={stadium[0]}>
                                                <div className='flex flex-row justify-between gap-5'>
                                                    <p>{stadium[0]}</p>
                                                    <p>{stadium[1]}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}