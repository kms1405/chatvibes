import { useNavigate,Link, Navigate } from "react-router-dom";

import { useState } from "react";
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, toast } from 'react-toastify';


// Login component
const Login=()=>{
    const [error, setError] = useState(false);
    const navigate = useNavigate()

    // To check user auth
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        const id = toast.loading("Please wait...")


        try {
            await signInWithEmailAndPassword(auth, email, password)
            toast.update(id, {render: "Successfully loggedIn", 
                        type: "success", isLoading: false,autoClose:3000});
            navigate("/")
            
        } catch (err) {

            if (err.toString().includes("auth/user-not-found")){
                err= "Email or Password is incorrect"
            }
            setError(true);
            toast.update(id, {render: `${err}`, type: "error", isLoading: false,autoClose:5000 });

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
            <ToastContainer />

        </div>
    )
}


export default Login;