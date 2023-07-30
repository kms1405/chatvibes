
import Add from "../img/add.png"
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import {v4 as uuid} from "uuid"
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


// To handle chat message and images
const Input=()=>{

    const [text,setText] = useState("")
    const [img,setImg] = useState(null)
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext)

    const handleSend = async() =>{
        console.log(img,"images")
        // To upload images
        if (img){
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

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
                        await updateDoc(doc(db,"chats",data.chatId),{
                            messages:arrayUnion({
                                id:uuid(),
                                text,
                                senderId:currentUser.uid,
                                date:Timestamp.now(),
                                img:downloadURL 
                            })
                        });
                        
                    });
                }
            );



             
        // To upload only text
        } else{
            await updateDoc(doc(db,"chats",data.chatId),{
                messages:arrayUnion({
                    id:uuid(),
                    text,
                    senderId:currentUser.uid,
                    date:Timestamp.now()  
                })
            });

        }


        await updateDoc(doc(db,"userChats",currentUser.uid),{
            [data.chatId + ".lastMessage"]:{
                text
            },
            [data.chatId + ".date"] : serverTimestamp(),
        });
        await updateDoc(doc(db,"userChats",data.user.uid),{
            [data.chatId + ".lastMessage"]:{
                text
            },
            [data.chatId + ".date"] : serverTimestamp(),
        });

        setImg(null);
        setText("")

    }

    return (
        
        <>
        {data.user?.displayName && <div className="input">
            <input type="text" placeholder="Type Something" value={text} onChange={e=>setText(e.target.value)}/>
            <div className="send">
                {/* <img src={Attach} alt=""/> */}
                <input type="file" style={{display:"none"}} id="file" value="" onChange={e=>setImg(e.target.files[0])}/>
                <label htmlFor="file">
                    <img src={Add} alt=""/>
                </label>
                <button onClick={handleSend}>Send</button>
            </div>
            
        </div>}
        
        </>

        
    )
}


export default Input;
