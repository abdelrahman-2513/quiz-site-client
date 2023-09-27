import { Routes, Route } from 'react-router-dom';
import Login from '../Pages/login';
import Signup from '../Pages/signup';
import Home from '../Pages/home';
import Quiz from '../Pages/quiz';
import Me from '../Pages/me';
import NewQuizzes from '../Pages/newQuizzes';
import TopStudents from '../Pages/topStudents';
function AppRoutes({ Quizzes, quiz, setQuiz }) {
    return (
        <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/" element={<Home quizzes={Quizzes} setQuiz={setQuiz} />}></Route>
            <Route path="/quiz/:quizId" element={<Quiz quiz={quiz} />}></Route>
            <Route path="/me" element={<Me />}></Route>
            <Route path="/new" element={<NewQuizzes setQuiz={setQuiz} />}></Route>
            <Route path="/top" element={<TopStudents />}></Route>
        </Routes>
    )
}

export default AppRoutes;