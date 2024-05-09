import { useNavigate, Navigate} from 'react-router-dom'
import { useAuth } from '../hooks'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Jury() {
    const navigate = useNavigate()
    const { logout, checkAuth, getAuth } = useAuth()
    const isAuth = checkAuth()

    const user = getAuth()

    useEffect(() => {
        axios.post(`http://localhost:8000/api/view-rating-stats/`, {jury_username: user.user[0]})
            .then(function (response) {
                setStatsTabState({averageRating: response.data.average_rating, ratingCount: response.data.rating_count});
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    if (!isAuth) return <Navigate to="/" />

    const [activeTab, setActiveTab] = React.useState('stats')

    const [statsTabState, setStatsTabState] = React.useState({averageRating: 0, ratingCount: 0})
    const [rateTabState, setRateTabState] = React.useState({sessionID: "", rating: ""})

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className='flex-initial flex flex-row justify-between bg-zinc-900 text-white py-3 px-5'>
                <h1 className='text-xl'>Jury</h1>
                <div className='flex flex-row bg-zinc-300 p-1 text-base gap-1 rounded-sm text-zinc-800'>
                    <button className={activeTab === "stats" ? "bg-white rounded-sm px-4" : "px-4"} onClick={() => {
                        setActiveTab('stats');
                    }}>Stats</button>
                    <button className={activeTab === "rate" ? "bg-white rounded-sm px-4" : "px-4"} onClick={() => setActiveTab('rate')}>Rate</button>
                </div>
                <button onClick={() => {logout(); navigate('/')}}><LogoutOutlinedIcon className='text-2xl'/></button>
            </div>
            <div className='h-full w-full flex-auto flex justify-center'>
                <div className='flex flex-col justify-center'>
                    <div className='shadow-sm rounded-md border p-7'>
                        {
                            activeTab === 'stats' && (
                                <div>
                                    <div>{`Average rating: ${statsTabState.averageRating}`}</div>
                                    <div>{`Rating count: ${statsTabState.ratingCount}`}</div>
                                </div>
                            )
                        }
                        {
                            activeTab === 'rate' && (
                                <div>
                                    <input placeholder='Session ID' className='border' value={rateTabState.sessionID} onChange={(e) => setRateTabState((prev) => {return { ...prev, sessionID: e.target.value}})}/>
                                    <input placeholder='Rating' className='border' value={rateTabState.rating} onChange={(e) => setRateTabState((prev) => {return { ...prev, rating: e.target.value}})}/>
                                    <button onClick={() => {
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
                                    }}>Rate</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}