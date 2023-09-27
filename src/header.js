import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Button, Image, Layout, Menu, Typography } from "antd";
import { HomeFilled } from '@ant-design/icons'
const { Header } = Layout;
function Head() {
    const cookies = new Cookies()
    const navigate = useNavigate()
    const handleLogin = function () {
        navigate('/login')
    }
    console.log()
    const handleSignup = function () {
        navigate('/signup')
    }
    const handleMenuClick = function (item) {
        navigate(`/${item.key}`)
    }
    const handleLogout = function () {
        cookies.set('jwt', "Loggingout", {
            expires: new Date(Date.now() + 1 * 60 * 1000),
            path: '/'
        })
        localStorage.clear();
        window.setTimeout(window.location.assign("/"), 5000)


    }
    function handleMe() {
        navigate('/me');
    }
    return (<Header className="App-header" style={{}}>
        <Typography.Title className="logo-title">Quizzes</Typography.Title>
        <Menu
            className="App-menu"
            onClick={handleMenuClick}
            mode="horizontal"
            items={[
                {
                    label: <HomeFilled className="home" />,
                    key: "",

                },
                {
                    label: "New Quizzes",
                    key: "new",

                },
                {
                    label: "Top Students",
                    key: "top",

                }
            ]}
        ></Menu>

        {
            !localStorage.getItem("userName") ? (<div>
                <Button className="primary" type="primary" onClick={handleLogin}>Login</Button>
                <Button className="secondry" type="default" onClick={handleSignup} >Sign-up</Button>
            </div>) :
                <div className="loggedin">
                    {< Button type="text" onClick={handleLogout}>Logout</Button>}
                    <div className="me" onClick={handleMe}>
                        <h4>{localStorage.getItem("userName").split(' ')[0].toUpperCase()}</h4>
                        <Image src={localStorage.getItem("userPhoto")}></Image>
                    </div>
                </div>
        }

    </Header>)
}

export default Head;
