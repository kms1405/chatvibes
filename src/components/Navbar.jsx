import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


// To Show navbar
const Navbar=()=>{

    const {currentUser} = useContext(AuthContext)

    
    return (
        <div className="navbar">
            <span className="logo">ChatVibes</span>
        <div className="user">
            <img src={currentUser.photoURL} alt=""/>
            <span>{currentUser.displayName}</span>
            <button onClick={()=>signOut(auth)}>Logout</button>

        </div>
        
        </div>
    )
}


export default Navbar;
