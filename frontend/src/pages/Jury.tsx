import { useNavigate, Navigate} from 'react-router-dom'
import { useAuth } from '../hooks'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {Input} from '@/components/ui/input'
import { Button } from "@/components/ui/button"

export default function Jury() {
    const navigate = useNavigate()
    const { logout, checkAuth, getAuth } = useAuth()
    const isAuth = checkAuth()

    if (!isAuth) return <Navigate to="/" />

    const user = getAuth()

    const [activeTab, setActiveTab] = React.useState('rate')

    const [statsTabState, setStatsTabState] = React.useState({averageRating: 0, ratingCount: 0})
    const [rateTabState, setRateTabState] = React.useState({sessionID: "", rating: ""})

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className='flex-initial flex flex-row justify-between bg-zinc-900 text-white py-3 px-5 items-center'>
                <h1 className='text-xl'>Jury</h1>
                <div className='flex flex-row bg-zinc-700 p-1 text-base gap-1 rounded-sm text-white w-3/12'>
                    <button className={activeTab === "rate" ? "bg-zinc-900 rounded-sm flex-1 p-1" : "flex-1 p-1 text-zinc-400"} onClick={() => setActiveTab('rate')}>Rate</button>
                    <button className={activeTab === "stats" ? "bg-zinc-900 rounded-sm flex-1 p-1" : "flex-1 p-1 text-zinc-400"} onClick={() => {
                        axios.post(`http://localhost:8000/api/view-rating-stats/`, {jury_username: user.user[0]})
                        .then(function (response) {
                            setStatsTabState({averageRating: response.data.average_rating, ratingCount: response.data.rating_count});
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                        setActiveTab('stats');
                    }}>Stats</button>
                </div>
                <button onClick={() => {logout(); navigate('/')}}><LogoutOutlinedIcon className='text-2xl'/></button>
            </div>
            <div className='h-full w-full flex-auto flex justify-center'>
                <div className='flex flex-col justify-center'>
                    <div className='shadow-sm rounded-md border p-7'>
                        {
                            activeTab === 'stats' && (
                                <div>
                                    <h1 className="text-2xl font-bold">Stats</h1>
                                    <div>{`Average rating: ${statsTabState.averageRating}`}</div>
                                    <div>{`Rating count: ${statsTabState.ratingCount}`}</div>
                                </div>
                            )
                        }
                        {
                            activeTab === 'rate' && (
                                <div className='flex flex-col gap-2'>
                                    <h1 className="text-2xl font-bold">Rate a Match Session</h1>
                                    <Input placeholder='Session ID' className='border' value={rateTabState.sessionID} onChange={(e) => setRateTabState((prev) => {return { ...prev, sessionID: e.target.value}})}/>
                                    <Input placeholder='Rating' className='border' value={rateTabState.rating} onChange={(e) => setRateTabState((prev) => {return { ...prev, rating: e.target.value}})}/>
                                    <Button onClick={() => {
                                        axios.post(`http://localhost:8000/api/rate-match-session/`, {
                                            session_id: rateTabState.sessionID,
                                            rating: parseFloat(rateTabState.rating),
                                            jury_username: user.user[0]
                                        })
                                        .then(function (response) {
                                            setRateTabState({sessionID: "", rating: ""});
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                    }}>Rate</Button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}