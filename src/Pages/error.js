import { Typography } from "antd";

function Err({ errorName }) {
    return (
        <div className="error">
            <Typography.Title>😑</Typography.Title>
            <h3>Sorry {errorName}</h3>
        </div>
    )
}
export default Err