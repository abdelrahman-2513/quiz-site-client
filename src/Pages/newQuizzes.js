import axios from "axios";
import { useEffect, useState } from "react";
import Err from "./error";
import Home from "./home";

function NewQuizzes({ setQuiz }) {
    const [quizzez, setQuizzes] = useState([]);
    const [err, setErr] = useState('');
    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/quizzes/newQuizzes`, { withCredentials: true })
            .then(response => {
                console.log(response.data.newQuizzes)
                return response.data.newQuizzes;
            }).then(data => setQuizzes(data))
            .catch(err => setErr('try Again later !'))
    }, [])

    return (<>
        {!err ? <Home quizzes={quizzez} setQuiz={setQuiz} ><h1 style={{ margin: '0px 40%' }}>NewQuizzes</h1></Home> :
            <Err errorName={err} />
        }
    </>)
}
export default NewQuizzes;