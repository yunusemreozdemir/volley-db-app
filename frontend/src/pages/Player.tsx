import { useNavigate, Navigate} from 'react-router-dom'
import { useAuth } from '../hooks'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Player() {
    const navigate = useNavigate()
    const { logout, checkAuth, getAuth } = useAuth()
    const isAuth = checkAuth()

    const user = getAuth()

    useEffect(() => {
        axios.post(`http://localhost:8000/api/view-players/`, {player_username: user.user[0]})
            .then(function (response) {
                setPlayers(response.data.players);
                setAvgHeight(response.data.avg_height);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    if (!isAuth) return <Navigate to="/" />

    const [players, setPlayers] = React.useState([])
    const [avgHeight, setAvgHeight] = React.useState(0)

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className='flex-initial flex flex-row justify-between bg-zinc-900 text-white py-3 px-5'>
                <h1 className='text-xl'>Player</h1>
                <button onClick={() => {logout(); navigate('/')}}><LogoutOutlinedIcon className='text-2xl'/></button>
            </div>
            <div className='h-full w-full flex-auto flex justify-center'>
                <div className='flex flex-col justify-center'>
                    <div className='shadow-sm rounded-md border p-7'>
                        <div>
                            <div>{`Average height of most played players: ${avgHeight}`}</div>
                            <ul>
                                {players.map((player) => (
                                    <li key={`${player[0]}${player[1]}${player[2]}${player[3]}`}>
                                        <div className='flex flex-row justify-between gap-5'>
                                            <p>{player[0]}</p>
                                            <p>{player[1]}</p>
                                            <p>{player[2]}</p>
                                            <p>{player[3]}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}