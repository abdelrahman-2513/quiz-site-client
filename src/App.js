import { useEffect, useState } from 'react';
import Head from './header'
import AppRoutes from "./Routes/routes";
import axios from 'axios';
import { Footer } from 'antd/es/layout/layout';

// const quizzes = [{ name: 'c++ Quiz_1', duration: '50 min', description: 'level one c++ quiz', questionNumber: 7 },
// { name: 'c Quiz_1', duration: '20 min', description: 'level one c++ quiz', questionNumber: 5 },
// { name: 'js Quiz_1', duration: '60 min', description: 'level one c++ quiz', questionNumber: 20 }]

function App() {
  const [quizzes, setQuizzes] = useState([])
  const [quiz, setQuiz] = useState({})

  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/quizzes/")
      .then(res => { return res.data.Quizzes }).then(data => { setQuizzes(data) })
  }, [])
  return <>
    <Head />
    <AppRoutes Quizzes={quizzes} quiz={quiz} setQuiz={setQuiz} />
    <Footer style={{ textAlign: 'center' }}>Quizzes site © {new Date().getFullYear()} created by Abdelrahman</Footer>
  </>
}


export default App;
