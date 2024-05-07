import { useNavigate } from 'react-router-dom'


import { Button } from "@/components/ui/button"

export default function ManagerPage () {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Manager Page</h1>
            <Button onClick={() => navigate('/')}>Go to Home</Button><br /><br />
            <Button onClick={() => navigate('/CreateUser')}>Create user</Button><br /><br />
            <Button onClick={() => navigate('/UpdateStadium')}>Update stadium name</Button><br /><br />
        </div>
    )
}