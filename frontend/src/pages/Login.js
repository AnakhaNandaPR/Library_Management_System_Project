import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import '../App.css';
function Login(){
    const navigate=useNavigate();
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const loginUser=()=>{
     axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
            username,
            password
        }
     )
     .then(res=>{
        localStorage.setItem(
            "token",
            res.data.access
        );
        localStorage.setItem("is_staff",res.data.is_staff);
        localStorage.setItem("username",res.data.username);

        alert(`Login Success! Welcome back,${res.data.username}`);
        navigate("/home");
     })
     .catch(()=>{
        alert("Invalid Credentials");
     })
}
return(
    <div className="login-page">
    <div className="login">
        <h2>Login</h2>
        <input placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
        <button onClick={loginUser}>Login</button>
    </div>
    </div>
);
}
export default Login;
