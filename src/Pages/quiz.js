import { Typography, Radio, Button, Form, Space } from "antd";
import { useEffect, useState } from "react";
import { CheckCircleTwoTone, ClockCircleFilled, LoadingOutlined, SmileOutlined } from "@ant-design/icons";
import axios from "axios";
// import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import Err from "./error";
function Quiz() {
    const [answers, setAnswer] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [myQuiz, setQuiz] = useState({})
    const [Start, setStart] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [grade, setGrade] = useState({});
    const { quizId } = useParams();
    // const headers = {
    //     'Content-Type': 'application/json',
    //     'Authorization': Cookies.get('jwt'),
    // };
    // console.log(headers)
    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/quizzes/${quizId}`, {
            withCredentials: true,
        })
            .then(res => { return res.data.quiz })
            .then(quiz => setQuiz(quiz)).catch(err => {
                setErrorMessage(err.response.data.message)
            }).catch(err => setErrorMessage(err.response.data.message))
    }, [quizId])
    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/answer/${quizId}/user`, {

            withCredentials: true,
        })
            .then(res => { return res.data.answer })
            .then(answer => {
                if (answer) {
                    setAnswered(true)
                    setGrade(answer)
                }
            }).catch(err => setErrorMessage(err.response.data.message))
    }, [quizId])

    function handleSubmit(e, id) {
        e.preventDefault();

        axios.post(`http://localhost:8000/api/v1/answer/${id}`, {
            question: answers
        }, {
            withCredentials: true
        })
            .then(res => { return res.data.newAnswer })
            .then(ans => { setGrade(ans); setAnswered(true); setTimeout(window.location.reload(), 2000) })
            .catch(err => { console.log(err); setErrorMessage(err.message) })

        // console.log(answers)
    }
    function handleStart() {
        setStart(true)
    }


    return (

        < div className="quiz-form" >
            {
                myQuiz.name ? <>
                    <Typography.Title>{myQuiz.name.split(' ')[0]}</Typography.Title>
                    <hr></hr>
                    <div className="form-elem">
                        <ClockCircleFilled />
                        <h3> : {`${myQuiz.time} mins`}</h3>
                    </div>
                    <hr></hr>
                    <div className="form-elem">
                        <h3>{`${myQuiz.description} 🧑‍💻`}</h3>
                    </div>
                    <hr></hr>
                    <div className="form-elem">
                        <SmileOutlined />
                        <h3> : {`${myQuiz.questionsNumber} Questions`}</h3>
                    </div>
                    <hr></hr>
                    <div className="form-elem">
                        <CheckCircleTwoTone twoToneColor={"#52c41a"} />
                        <h3> : {`${myQuiz.complexity}`}</h3>
                    </div>
                    <hr></hr>
                    {!Start && !answered && <Button type="primary" onClick={handleStart}>Start Exam</Button>}
                    {
                        Start ? <>
                            <h2 className="exam-title">Exam</h2>
                            <div className="choices">
                                {myQuiz.questions &&
                                    myQuiz.questions.map((question, i) => {
                                        return (<Question que={question} answers={answers} setAnswer={setAnswer} key={i} />)
                                    })
                                }
                            </div>
                            <Button type="primary" onClick={(e) => handleSubmit(e, quizId)}> Submit </Button></> : !answered ? <h4>Enter the exam which help you to improve your skills and rank 😊</h4>
                            : answered && <><div className="form-elem" style={{ margin: "auto" }}>
                                <h3>{grade.grade >= 50 ? 'Congratulation!😊' : 'review your answer to improve yourself 🧑‍💻'}</h3>
                            </div>
                                <AnsweredForm ques={myQuiz.questions} que={grade.question}><h4>Your Grade : {grade.grade} %</h4></AnsweredForm>
                            </>
                    }
                </> : errorMessage ? <Err errorName={errorMessage} />
                    : <div className="form-elem" style={{ margin: "auto" }}>
                        <h3>please Wait!😊</h3>
                        <LoadingOutlined />
                    </div>}
        </div >)
}


function Question({ que, answers, setAnswer }) {
    const questionId = que._id;
    return (
        <div className="choice">
            <Form.Item>

                <h4>{que.title}</h4>
                <Radio.Group >
                    <Space direction="vertical">

                        {


                            que.choices.map((choice, i) => {
                                return <Choice questionId={questionId} choice={choice} key={i} answers={answers} setAnswer={setAnswer} />
                            })
                        }
                    </Space>
                </Radio.Group>
            </Form.Item>
        </div>
    )
}
function Choice({ choice, setAnswer, answers, questionId }) {

    // let finalAnswer = []
    function handleAnswerClick(id, choice) {
        const answer = { id: id, answer: choice }

        const exsistAnswer = answers.find(a => a.id === answer.id);
        if (exsistAnswer)
            setAnswer(answers => answers.map(el => {
                if (el.id === answer.id)
                    el.answer = answer.answer
                return el
            }))
        else
            setAnswer(answers => [...answers, answer])
    }
    return (
        <Radio value={choice.text} onChange={(e) => handleAnswerClick(questionId, e.target.value)}><Typography.Text>{choice.text}</Typography.Text></Radio>
    )
}
function AnsweredForm({ ques, que, children }) {
    return (
        <Form disabled={true}>

            <Form.Item >{children}</Form.Item>

            {que.map((que, i) => {
                return (
                    <Form.Item key={i}>
                        <Space direction="horizental">
                            <h4 key={i}>{ques.find(ques => ques._id === que.id).title}</h4>
                            <Radio checked={true}>{que.answer}</Radio>
                        </Space>
                    </Form.Item>
                )

            })}

        </Form>
    )
}
export default Quiz;