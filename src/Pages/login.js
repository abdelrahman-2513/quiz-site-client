import { React, useState } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie';
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
function Login() {

    const [err, setErr] = useState("")

    function OnFinish(values) {
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/v1/users/logIn',
            data: {
                email: values.email,
                password: values.password
            },

        }).then(response => {
            console.log(response.data)

            Cookies.set('jwt', response.data.token, {
                expires: 7,
                path: '/'
            })
            return response.data.data.user;

            // return response.data.user
        })
            .then(data => {
                localStorage.setItem('userName', data.name)
                localStorage.setItem('userRole', data.role)
                localStorage.setItem('userPhoto', data.photo)
                localStorage.setItem('userId', data._id)
                alert("Loggedin successfully!")
                setTimeout(window.location.assign("/"), 5000)
            })
            .catch(err => setErr(err.response.data.message))
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={OnFinish}
        >
            <Typography.Title className='login-title'>Log-in</Typography.Title>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>

            </Form.Item>
            {err && <Typography.Text style={{ color: 'red' }}>{err}</Typography.Text>}
        </Form>
    );
};
export default Login;