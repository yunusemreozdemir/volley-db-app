import { Button } from "@/components/ui/button"
import { useNavigate, Navigate} from 'react-router-dom'
import { useAuth } from '../hooks'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import React, { useState } from 'react';
import axios from 'axios';

export default function DBManager () {
    const navigate = useNavigate()
    const { logout, checkAuth, getAuth } = useAuth()
    const isAuth = checkAuth()

    if (!isAuth) return <Navigate to="/" />

    const user = getAuth()

    
    const [activeTab, setActiveTab] = React.useState('Coach')
    const [createData, setCreateData] = React.useState({
        username: "",
        password: "",
        name: "",
        surname: "",
        date_of_birth: "",
        height: "",
        weight: "",
        nationality: ""
    })
    const [updateData, setUpdateData] = React.useState({
        previous_name: "",
        name: ""
    })

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className='flex-initial flex flex-row justify-between bg-zinc-900 text-white py-3 px-5'>
                <h1 className='text-xl'>DBManager</h1>
                <button onClick={() => {logout(); navigate('/')}}><LogoutOutlinedIcon className='text-2xl'/></button>
            </div>
            <div className="p-8">
                <div className="flex flex-row gap-5">
                    <div className="flex-[70%] rounded-md shadow-sm border p-5 flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">Create User</h1>
                        <div className='flex flex-row bg-zinc-100 p-1 text-base gap-1 rounded-sm text-zinc-800'>
                            <button className={activeTab === "Coach" ? "bg-white rounded-sm flex-1 p-1" : "flex-1 p-1"} onClick={() => setActiveTab('Coach')}>Coach</button>
                            <button className={activeTab === "Jury" ? "bg-white rounded-sm flex-1 p-1" : "flex-1 p-1"} onClick={() => setActiveTab('Jury')}>Jury</button>
                            <button className={activeTab === "Player" ? "bg-white rounded-sm flex-1 p-1" : "flex-1 p-1"} onClick={() => setActiveTab('Player')}>Player</button>
                        </div>
                        <input placeholder="Username" value={createData.username} onChange={(e) => setCreateData((prev) => {return { ...prev, username: e.target.value}})}/>
                        <input placeholder="Password" value={createData.password} onChange={(e) => setCreateData((prev) => {return { ...prev, password: e.target.value}})}/>
                        <input placeholder="Name" value={createData.name} onChange={(e) => setCreateData((prev) => {return { ...prev, name: e.target.value}})}/>
                        <input placeholder="Surname" value={createData.surname} onChange={(e) => setCreateData((prev) => {return { ...prev, surname: e.target.value}})}/>
                        {
                            (activeTab === "Coach" || activeTab === "Jury") && (
                                <input placeholder="Nationality" value={createData.nationality} onChange={(e) => setCreateData((prev) => {return { ...prev, nationality: e.target.value}})}/>
                            )
                        }
                        {
                            activeTab === "Player" && (
                                <>
                                    <input placeholder="Date of Birth" value={createData.date_of_birth} onChange={(e) => setCreateData((prev) => {return { ...prev, date_of_birth: e.target.value}})}/>
                                    <input placeholder="Height" value={createData.height} onChange={(e) => setCreateData((prev) => {return { ...prev, height: e.target.value}})}/>
                                    <input placeholder="Weight" value={createData.weight} onChange={(e) => setCreateData((prev) => {return { ...prev, weight: e.target.value}})}/>
                                </>
                            )
                        }
                        <Button className="w-full bg-zinc-900" onClick={
                            () => {
                                axios.post(`http://localhost:8000/api/create-user/`, {...createData, usertype: activeTab})
                                .then(function (response) {
                                    setCreateData({username: "", password: "", name: "", surname: "", date_of_birth: "", height: "", weight: "", nationality: ""});
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            }
                        }>Create</Button>
                    </div>
                    <div className="flex-[30%] rounded-md shadow-sm border p-5 flex flex-col gap-2 h-min">
                        <h1 className="text-2xl font-bold">Update Stadium</h1>
                        <div className="flex flex-col gap-2 w-full">
                            <input placeholder="Previous Name" value={updateData.previous_name} onChange={(e) => setUpdateData((prev) => {return { ...prev, previous_name: e.target.value}})}/>
                            <input placeholder="New Name" value={updateData.name} onChange={(e) => setUpdateData((prev) => {return { ...prev, name: e.target.value}})}/>
                            <Button className="w-full bg-zinc-900" onClick={
                                () => {
                                    axios.post(`http://localhost:8000/api/update-stadium/`, {previous_name: updateData.previous_name, name: updateData.name})
                                    .then(function (response) {
                                        setUpdateData({previous_name: "", name: ""});
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });  
                                }
                            }>Update</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}