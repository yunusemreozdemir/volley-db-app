import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'


import { Button } from "@/components/ui/button"

export default function Coach () {
    const navigate = useNavigate()
    const { logout, checkAuth, getAuth } = useAuth()
    const isAuth = checkAuth()

    if (!isAuth) return <Navigate to="/" />

    const user = getAuth()

    console.log(user)

    return (
        <div>
            <h1>Coach Page</h1>
            <Button onClick={() => navigate('/')}>Go to Home</Button><br /><br />
            <Button onClick={() => navigate('/DeleteMatchSession')}>Delete match session</Button><br /><br />
            <Button onClick={() => navigate('/AddMatchSession')}>Add match session</Button><br /><br />
            <Button onClick={() => navigate('/CreateSquad')}>Create squad</Button><br /><br />
            <Button onClick={() => navigate('/ViewStadiums')}>View stadiums</Button><br /><br />
            <Button onClick={() => {
                logout()
                navigate('/')
            }}>Logout</Button><br /><br />
        </div>
    )
}