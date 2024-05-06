import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';
import { useAuth } from '../hooks'

import { Button } from "@/components/ui/button"

export default function ManagerPage () {
    //const { checkAuth, login } = useAuth()
    // const isAuth = checkAuth()
    const navigate = useNavigate()

    // if (!isAuth) return <Navigate to="/" />

    return (
        <div>
            <h1>Manager Page</h1>
            <Button onClick={() => navigate('/')}>Go to Home</Button><br /><br />
            <Button onClick={() => navigate('/CreateUser')}>Create user</Button><br /><br />
            <Button onClick={() => navigate('/UpdateStadium')}>Update stadium name</Button><br /><br />
        </div>
    )
}