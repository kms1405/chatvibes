import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth,db,storage } from "../firebase";
import add from "../img/addavatar.png";
import { useState } from "react";
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate,Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


// Register  page
const Register = () => {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    // To create user
    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        const id = toast.loading("Please wait...")

        try {
            
            const res = await createUserWithEmailAndPassword(auth, email, password)
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed',
                
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                  case 'paused':
                    break;
                  case 'running':
                    break;
                }
              }, 
              (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                  case 'storage/canceled':
                    // User canceled the upload
                    break;
            
                  // ...
            
                  case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
              },
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user,{
                            displayName,
                            photoURL:downloadURL,

                        })


                        await setDoc(doc(db,"users",res.user.uid), {
                            uid:res.user.uid,
                            displayName:displayName,
                            email:email,
                            photoURL:downloadURL
                        });

                        await setDoc(doc(db,"userChats",res.user.uid),{});
                        toast.update(id, {render: "Your email has been registered successfully", 
                        type: "success", isLoading: false,autoClose:3000});
                        navigate("/");
                        
                    });
                }
            );

        } catch (err) {
            if (err.toString().includes("email-already-in-use")){
                err= "Email already Exists"
            } else if (err.toString().includes("at least 6 characters")) {
                err = "Password should be at least 6 characters"
            }

            setError(true);
            toast.update(id, {render: `${err}`, type: "error", isLoading: false,autoClose:5000 });
            return

        };
    }

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">ChatVibes</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Display name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <input style={{ display: "none" }} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={add} alt="1" />
                        <span>Add an Avatar</span>
                    </label>
                    <button>Sign Up</button>
                </form>
                <p>You do have an account? <Link to="/login"> Login </Link></p>
            </div>
            <ToastContainer />
        </div>
    )
}


export default Register;