import React from 'react';
import axios from 'axios'
import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
function Signup() {
    const onFinish = values => {
        console.log(values.name,
            values.email,
            values.password,
            values.confirmPassword)

        axios.post('http://localhost:8000/api/v1/users/signUp', {

            email: values.email,
            name: values.name,
            password: values.password,
            confirmPassword: values.confirmPassword

        }).then(res => { return res.data.data.user }).then(data => {
            localStorage.setItem('userName', data.name)
            localStorage.setItem('userRole', data.role)
            localStorage.setItem('userPhoto', data.photo)
            localStorage.setItem('userEmail', data.email)
            localStorage.setItem('userId', data._id)
            alert("Loggedin successfully!")
            setTimeout(window.location.assign("/"), 5000)
        }).catch(err => console.log(err))

    };

    return (
        <Form
            name="normal_signup"
            className="signup-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Typography.Title className='login-title'>Sign-up</Typography.Title>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Email!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="name"
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
            <Form.Item
                name="confirmPassword"
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
                    placeholder="confirm password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="signup-form-button">
                    Signup
                </Button>

            </Form.Item>
        </Form>
    );
};

export default Signup;