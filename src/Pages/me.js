import { AppstoreOutlined, CopyrightCircleFilled, LoadingOutlined, LockOutlined, SettingOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { Button, Form, Input, Menu, Card, Typography, Radio } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Err from "./error"
import Cookies from "universal-cookie"
import FormItemLabel from "antd/es/form/FormItemLabel"

function Me() {
    const [user, setUser] = useState({})
    const [users, setUsers] = useState([])
    const [quizzes, setQuizzes] = useState([])
    const [flag, setFlag] = useState("Me")
    const [err, setErr] = useState("")
    const [userAnswers, setUserAnswers] = useState([])
    const isAdmin = localStorage.userRole === 'admin';
    const userId = window.localStorage.userId;
    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/users/${window.localStorage.userId}`, { withCredentials: true })
            .then(res => { return res.data.user })
            .then(data => setUser(data))
            .catch(err => console.log(err))
    }, [userId])

    function onChange(e) {
        console.log(e.key)
        setFlag(e.key)
        if (e.key === "Quiz") {
            axios.get('http://localhost:8000/api/v1/answer/user', { withCredentials: true })
                .then(response => { console.log(response); return response.data.userAnswers })
                .then(data => { if (data.length === 0) setErr("You have no answered quizzes!"); setUserAnswers(data) })
                .catch(err => console.log(err))
        }
    }
    function getItem(label, key, icon) {
        return {
            key,
            icon,

            label,

        };

    }
    function handleAdminClick(e) {
        console.log(e.key)
        if (e.key === 'users') {
            axios.get('http://localhost:8000/api/v1/users/', { withCredentials: true })
                .then(response => { return response.data.users })
                .then(data => { setUsers(data); setFlag(e.key) })
                .catch(err => setErr(err.response.data.message))
        }
        if (e.key === 'quizzes') {
            axios.get('http://localhost:8000/api/v1/quizzes/', { withCredentials: true })
                .then(response => { return response.data.Quizzes })
                .then(data => { console.log(data); setQuizzes(data); setFlag(e.key) })
                .catch(err => setErr(err.response.data.message))
        }
    }

    const items = [getItem('My data', 'Me', <SettingOutlined />),
    getItem('My Quizzes', 'Quiz', <AppstoreOutlined />)]
    const adminItems = [getItem('Users', 'users', <UsergroupAddOutlined />),
    getItem('quizzes', 'quizzes', <AppstoreOutlined />)]
    return (<div className="mine">
        <div className="navBar">
            <Menu
                onClick={onChange}
                style={{
                    width: 256,
                }}
                defaultSelectedKeys={['Me']}
                mode="inline"
                items={items}
            />
            {
                isAdmin &&
                <Menu
                    onClick={handleAdminClick}
                    style={{
                        width: 256,
                    }}
                    defaultSelectedKeys={['Me']}
                    mode="inline"
                    items={adminItems}
                />

            }
        </div >
        {
            flag === 'Me' ? <MyData user={user} /> :
                flag === 'Quiz' ? <MyQuiz err={err} quizzes={userAnswers} />
                    : flag === 'users' ? <Users users={users} /> :
                        flag === 'quizzes' && <Quizzes err={err} quizzes={quizzes} />
        }

    </div>
    )
}
function MyData({ user }) {
    const [err, setErr] = useState("")
    const cookies = new Cookies()

    function onFinish(e) {

        console.log(e)
        axios.patch('http://localhost:8000/api/v1/users/updateMe', {
            name: e.name,
            email: e.email
        }, { withCredentials: true })
            .then(res => setTimeout(window.location.reload(), 5000))
            .catch(err => setErr(err.response.message))
    }
    function updatePassword(values) {
        console.log(values)
        axios.patch('http://localhost:8000/api/v1/users/updatePassword', {
            currentPassword: values.currentPassword,
            password: values.password,
            confirmPassword: values.confirmPassword,
        }, { withCredentials: true })
            .then(res => {
                cookies.set('jwt', "Loggingout", {
                    expires: new Date(Date.now() + 1 * 60 * 1000),
                    path: '/'
                })
                localStorage.clear();
                window.setTimeout(window.location.assign("/"), 5000)
            })
            .catch(err => { console.log(err); setErr(err.response.data.message) })
    }
    return (<div className="Me-data">

        <Form onFinish={onFinish}>
            <Form.Item
                name="email"
            >
                <Input type="email" value={user.email} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={user.email} />
            </Form.Item>
            <Form.Item
                name="name"

            >
                <Input type="text" value={user.name} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={user.name} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Update Data
                </Button>
            </Form.Item>
        </Form>
        {err && <Typography.Text style={{ color: 'red' }}>{err}</Typography.Text>}
        <Form onFinish={updatePassword}>
            <Form.Item
                name="currentPassword"
                rules={[
                    {
                        required: true,
                        message: 'Please input your current Password!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Current Password"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input a valid Password matches confirm password!',
                        min: 8
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item
                name="confirmPassword"
                rules={[
                    {
                        required: true,
                        message: 'Please input a valid Password matches password!',
                        min: 8

                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Confirm Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Update Password
                </Button>
            </Form.Item>
        </Form>
    </div>)
}
function MyQuiz({ quizzes, err }) {
    return (
        quizzes.length > 0 ? <div className="quizzes">
            {quizzes.map((quiz, i) => {
                return <MiniQuiz quiz={quiz.quiz} key={i} />

            })}
        </div> : err ? <Err errorName={err} /> : <div className="form-elem" style={{ margin: "auto" }}>
            <h3>please Wait!😊</h3>
            <LoadingOutlined />
        </div>
    )
}
function Quizzes({ quizzes, err }) {
    const [editQuiz, setEditQuiz] = useState({});
    return (
        Object.keys(editQuiz).length === 0 && quizzes.length > 0 ? <div className="quizzes">
            {quizzes.map((quiz, i) => {
                return <MiniQuizAdmin quiz={quiz} key={i} editQuiz={setEditQuiz} />

            })}
        </div> : Object.keys(editQuiz).length > 0 ? <EditQuiz quiz={editQuiz} />
            : err ? <Err errorName={err} /> : <div className="form-elem" style={{ margin: "auto" }}>
                <h3>please Wait!😊</h3>
                <LoadingOutlined />
            </div>
    )
}
function MiniQuiz({ quiz, }) {
    const navigate = useNavigate()
    const quizId = quiz._id;
    function handleQuizClick(val) {
        navigate(`/quiz/${val}`)
    }
    return (

        < Card title={quiz.name} className="quiz-admin" onClick={() => handleQuizClick(quizId)}>
            <h3>quiz duration : {quiz.time}</h3>
            <h3>quiz questions : {quiz.questionsNumber}</h3>
            <h3>quiz description : {quiz.description}</h3>
        </Card >

    )
}
function MiniQuizAdmin({ quiz, editQuiz }) {
    const quizId = quiz._id;
    function handleQuizClick(val) {
        axios.get(`http://localhost:8000/api/v1/quizzes/${quiz._id}`, { withCredentials: true })
            .then(response => { return response.data.quiz })
            .then(data => editQuiz(data)).catch(err => console.log(err))
    }
    return (

        < Card title={quiz.name} className="quiz-admin" onClick={() => handleQuizClick(quizId)}>
            <h3>quiz duration : {quiz.time}</h3>
            <h3>quiz questions : {quiz.questionsNumber}</h3>
            <h3>quiz description : {quiz.description}</h3>
        </Card >

    )
}
function EditQuiz({ quiz }) {
    function onFinish(e) {

        console.log(e)
        axios.patch(`http://localhost:8000/api/v1/quizzes/${quiz._id}`, {
            name: e.name,
            email: e.email,
            role: e.role,
        }, { withCredentials: true })
            .then(res => setTimeout(window.location.reload(), 5000))
            .catch(err => console.log(err))
    }
    function deleteQuiz(id) {
        axios.delete(`http://localhost:8000/api/v1/quizzes/${id}`, { withCredentials: true })
            .then(res => setTimeout(window.location.reload(), 5000))
            .catch(err => console.log(err))
    }
    return <div className="Me-data">

        <Form onFinish={onFinish}>
            <Form.Item
                name="id"
            >
                <Input type="email" value={quiz._id} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={quiz._id} />
            </Form.Item>

            <Form.Item
                name="name"

            >
                <Input type="text" value={quiz.name} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={quiz.name} />
            </Form.Item>
            <Form.Item
                name="description"

            >
                <Input type="text" value={quiz.description} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={quiz.description} />
            </Form.Item>
            {
                quiz.questions.map((question, i) => {
                    return (
                        <Form name="question" key={i}>
                            <Form.Item
                                name="title"

                            >
                                <FormItemLabel>question - {i}</FormItemLabel>
                                <Input type="text" value={question.title} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={question.title} />
                            </Form.Item>
                            {question.choices.map((choice, i) => {
                                return (<Form name="choice" key={i}>
                                    <Form.Item
                                        name="text"

                                    >
                                        <FormItemLabel>choice - {i}</FormItemLabel>
                                        <Input type="text" value={choice.text} prefix={<CopyrightCircleFilled className="site-form-item-icon" />} placeholder={choice.text} />
                                    </Form.Item>
                                    <Form.Item
                                        name="isCorrect"

                                    >
                                        <Radio checked={true}>{choice.isCorrect.toString()}</Radio>
                                    </Form.Item>
                                </Form>)
                            })}
                        </Form>)
                })
            }
            <Form.Item
                name="questionsNumber"

            >
                <Input type="text" value={quiz.questionsNumber} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={quiz.questionsNumber} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Update Data
                </Button>
            </Form.Item>
            <Form.Item>
                <Button style={{ backgroundColor: 'red' }} type="primary" onClick={() => deleteQuiz(quiz._id)} className="login-form-button">
                    delete
                </Button>
            </Form.Item>
        </Form>
    </div>
}
function Users({ users }) {
    const [editUser, setEditUser] = useState({})

    return (<>
        {
            Object.keys(editUser).length === 0 ?
                <div className="users">
                    {users.map((user, i) => {
                        return <User user={user} key={i} editUser={setEditUser} />
                    })
                    }
                </div>
                : Object.keys(editUser).length >= 0 ? <EditUser user={editUser} /> : <div className="form-elem" style={{ margin: "auto" }}>
                    <h3>please Wait!😊</h3>
                    <LoadingOutlined />
                </div>
        }
    </>
    )
}
function User({ user, editUser }) {
    function handleUserClick(val) {
        axios.get(`http://localhost:8000/api/v1/users/${val}`, { withCredentials: true })
            .then(response => { return response.data.user })
            .then(data => editUser(data)).catch(err => console.log(err))
    }
    return (
        < Card title={user.name} className="user" onClick={() => handleUserClick(user._id)}>
            <h3>User Role : {user.role}</h3>
            <h3>User Email : {user.email}</h3>
            <h3>User Quizzes : {user.answers.length}</h3>
        </Card >
    )
}
function EditUser({ user }) {
    function onFinish(e) {

        console.log(e)
        axios.patch(`http://localhost:8000/api/v1/users/${user._id}`, {
            name: e.name,
            email: e.email,
            role: e.role,
        }, { withCredentials: true })
            .then(res => setTimeout(window.location.reload(), 5000))
            .catch(err => console.log(err))
    }
    function deleteUser(id) {
        axios.delete(`http://localhost:8000/api/v1/users/${id}`, { withCredentials: true })
            .then(res => setTimeout(window.location.reload(), 5000))
            .catch(err => console.log(err))
    }
    return <div className="Me-data">

        <Form onFinish={onFinish}>
            <Form.Item
                name="id"
            >
                <Input type="email" value={user._id} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={user._id} />
            </Form.Item>
            <Form.Item
                name="email"
            >
                <Input type="email" value={user.email} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={user.email} />
            </Form.Item>
            <Form.Item
                name="name"

            >
                <Input type="text" value={user.name} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={user.name} />
            </Form.Item>
            <Form.Item
                name="role"

            >
                <Input type="text" value={user.role} prefix={<UserOutlined className="site-form-item-icon" />} placeholder={user.role} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Update Data
                </Button>
            </Form.Item>
            <Form.Item>
                <Button style={{ backgroundColor: 'red' }} type="primary" onClick={() => deleteUser(user._id)} className="login-form-button">
                    delete
                </Button>
            </Form.Item>
        </Form>
    </div>
}
export default Me