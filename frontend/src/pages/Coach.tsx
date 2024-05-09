import { useNavigate, Navigate} from 'react-router-dom'
import { useAuth } from '../hooks'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import React, { useState } from 'react';
import axios from 'axios';

import {Input} from '@/components/ui/input'
import { Button } from "@/components/ui/button"

export default function Coach () {
    const navigate = useNavigate()
    const { logout, checkAuth, getAuth } = useAuth()
    const isAuth = checkAuth()

    if (!isAuth) return <Navigate to="/" />

    const user = getAuth()

    const [activeTab, setActiveTab] = React.useState('addMatchSession')

    const [addTabState, setAddTabState] = React.useState({stadium_name: "", stadium_country: "", date: "", time_slot: "", assigned_jury_name: "", assigned_jury_surname: ""})
    const [deleteTabState, setDeleteTabState] = React.useState('')
    const [createTabState, setCreateTabState] = React.useState({ players: [], nameInputValue: "", positionInputValue: "", session_id: ""})
    const [viewTabState, setViewTabState] = React.useState([])
 

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className='flex-initial flex flex-row justify-between bg-zinc-900 text-white py-3 px-5 items-center'>
                <h1 className='text-xl'>Coach</h1>
                <div className='flex flex-row bg-zinc-700 p-1 text-base gap-1 rounded-sm text-white whitespace-nowrap'>
                    <button className={activeTab === "addMatchSession" ? "bg-zinc-900 rounded-sm flex-1 py-1 px-4" : "flex-1 py-1 px-4 text-zinc-400"} onClick={() => setActiveTab('addMatchSession')}>Add Match Session</button>
                    <button className={activeTab === "deleteMatchSession" ? "bg-zinc-900 rounded-sm flex-1 py-1 px-4" : "flex-1 py-1 px-4 text-zinc-400"} onClick={() => setActiveTab('deleteMatchSession')}>Delete Match Session</button>
                    <button className={activeTab === "createSquad" ? "bg-zinc-900 rounded-sm flex-1 py-1 px-4" : "flex-1 py-1 px-4 text-zinc-400"} onClick={() => setActiveTab('createSquad')}>Create Squad</button>
                    <button className={activeTab === "viewStadiums" ? "bg-zinc-900 rounded-sm flex-1 py-1 px-4" : "flex-1 py-1 px-4 text-zinc-400"} onClick={() => {
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
                                <div className='flex flex-col gap-2'>
                                    <h1 className="text-2xl font-bold">Add Match Session</h1>
                                    <Input placeholder='Stadium Name' className='border' value={addTabState.stadium_name} onChange={(e) => setAddTabState((prev) => {return { ...prev, stadium_name: e.target.value}})}/>
                                    <Input placeholder='Stadium Country' className='border' value={addTabState.stadium_country} onChange={(e) => setAddTabState((prev) => {return { ...prev, stadium_country: e.target.value}})}/>
                                    <Input placeholder='Date' className='border' value={addTabState.date} onChange={(e) => setAddTabState((prev) => {return { ...prev, date: e.target.value}})}/>
                                    <Input placeholder='Time Slot' className='border' value={addTabState.time_slot} onChange={(e) => setAddTabState((prev) => {return { ...prev, time_slot: e.target.value}})}/>
                                    <Input placeholder='Jury Name' className='border' value={addTabState.assigned_jury_name} onChange={(e) => setAddTabState((prev) => {return { ...prev, assigned_jury_name: e.target.value}})}/>
                                    <Input placeholder='Jury Surname' className='border' value={addTabState.assigned_jury_surname} onChange={(e) => setAddTabState((prev) => {return { ...prev, assigned_jury_surname: e.target.value}})}/>
                                    <Button onClick={() => {
                                        axios.post(`http://localhost:8000/api/add-match-session/`, {
                                            ...addTabState,
                                            "coach_username": user.user[0],
                                        
                                        })
                                        .then(function (response) {
                                            setAddTabState({stadium_name: "", stadium_country: "", date: "", time_slot: "", assigned_jury_name: "", assigned_jury_surname: ""});
                                        })
                                        .catch(function (error) {
                                          console.log(error);
                                        }); 
                                    }}>Add</Button>
                                </div>
                            )
                        }
                        {
                            activeTab === 'deleteMatchSession' && (
                                <div className='flex flex-col gap-2'>
                                    <h1 className="text-2xl font-bold">Delete Match Session</h1>
                                    <Input placeholder='Session ID' className='' value={deleteTabState} onChange={(e) => setDeleteTabState(e.target.value)}/>
                                    <Button onClick={() => {
                                        axios.post(`http://localhost:8000/api/delete-match-session/`, {"session_ID": deleteTabState})
                                        .then(function (response) {
                                            setDeleteTabState('');
                                        })
                                        .catch(function (error) {
                                          console.log(error);
                                        }); 
                                    }}>Delete</Button>
                                </div>
                            )
                        }
                        {
                            activeTab === 'createSquad' && (
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl font-bold">Create Squad</h1>
                                    <div className="flex flex-col gap-2">
                                    <Input className="border" placeholder='Session ID' value={createTabState.session_id} onChange={(e) => setCreateTabState((prev) => {return { ...prev, session_id: e.target.value}})}/>
                                    <div className='flex flex-row gap-2'>
                                        <Input className="border" placeholder="Player Name" value={createTabState.nameInputValue} onChange={(e) => setCreateTabState((prev) => {return { ...prev, nameInputValue: e.target.value}})} />
                                        <Input className="border" placeholder="Position" value={createTabState.positionInputValue} onChange={(e) => setCreateTabState((prev) => {return { ...prev, positionInputValue: e.target.value}})} />
                                        <Button onClick={() => {
                                            setCreateTabState((prev) => {
                                                return { ...prev, players: [...prev.players, {name: prev.nameInputValue, position: prev.positionInputValue}], nameInputValue: '', positionInputValue: ''}
                                            })
                                        }}>Add</Button>
                                    </div>
                                    </div>
                                    <ul className='flex flex-col gap-1'>
                                        {createTabState.players.map((player) => (
                                            <li key={player.name}>{player.name + " - " + player.position}</li>
                                        ))}
                                    </ul>
                                    <Button onClick={() => {
                                        axios.post(`http://localhost:8000/api/create-squad/`, {session_id: createTabState.session_id, players: createTabState.players, coach_username: user.user[0]})
                                        .then(function (response) {
                                            setCreateTabState({ players: [], nameInputValue: '', positionInputValue: "", session_id: ''});
                                        })
                                        .catch(function (error) {
                                          console.log(error);
                                        }); 
                                    }}>Create</Button>
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