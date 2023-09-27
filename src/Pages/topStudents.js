import { useEffect, useState } from "react";
import Err from "./error";
import { Card } from "antd";
import axios from "axios";

function TopStudents() {
    const [students, setStudents] = useState([]);
    const [err, setErr] = useState('');
    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/users/topUsers`, { withCredentials: true })
            .then(response => {
                console.log(response.data)
                return response.data.topUsers;
            }).then(data => setStudents(data))
            .catch(err => setErr('try Again later !'))
    }, [])

    return (<>
        <h1 style={{ marginLeft: '40%' }}>Top Students</h1>
        {!err ? <Users users={students} /> :
            <Err errorName={err} />
        }
    </>
    )
}
function Users({ users }) {
    return (<div className="users">
        {users.map((user, i) => {
            return <User user={user} key={i} />
        })}
    </div>)
}
function User({ user }) {
    function handleUserClick(val) {
        console.log(val)
    }
    return (
        < Card title={user.name} className="user" onClick={() => handleUserClick(user._id)}>
            <h3>User Total grade : {user.totalGrade}</h3>
            <h3>User Average : {user.avgGrade}</h3>
            <h3>User Quizzes : {user.Quizzes}</h3>
        </Card >
    )
}
export default TopStudents;