import { useNavigate,Link, Navigate } from "react-router-dom";

import { useState } from "react";
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";



const Login=()=>{
    const [error, setError] = useState(false);
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;


        try {

            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
            
        } catch (err) {
            setError(true);
            return

        };}

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">ChatVibes</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit} >
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password" />
                    
                    <button>Sign In</button>
                </form>
                <p>You don't have an account? <Link to="/register"> Register </Link> </p>
            </div>
        </div>
    )
}


export default Login;