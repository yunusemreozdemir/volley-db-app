import { useNavigate } from 'react-router-dom'


import { Button } from "@/components/ui/button"

export default function CoachPage () {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Coach Page</h1>
            <Button onClick={() => navigate('/')}>Go to Home</Button><br /><br />
            <Button onClick={() => navigate('/AddMatchSession')}>Add match session</Button><br /><br />
            <Button onClick={() => navigate('/CreateSquad')}>Create squad</Button><br /><br />
            <Button onClick={() => navigate('/ViewStadiums')}>View stadiums</Button><br /><br />
        </div>
    )
}