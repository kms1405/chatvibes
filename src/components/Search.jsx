import { useContext, useState } from "react";
import { collection, query, where, getDocs, setDoc, updateDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";



// Search bar component
const Search = () => {

    const [userName, setUserName] = useState("");
    const [err, setErr] = useState(false);
    const { currentUser } = useContext(AuthContext)
    const { dispatch } = useContext(ChatContext)
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUser,setFilteredUser] = useState([])

    // Fetching users based on serch keyword
    const handleSearch = async (e) => {
        setUserName(e.target.value)
        if (allUsers.length){
            let filterList=[];
            let u;
            for (u of allUsers){
                console.log(u,"userssss",u.displayName.includes(e.target.value))
                if (u.displayName.toLowerCase().includes(e.target.value.toLowerCase())){
                    filterList.push(u)
                }
            }

            setFilteredUser(filterList)

        } else{
            try {
                const querySnap = await getDocs(collection(db, "users"));
                let userList = []
                querySnap.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    userList.push(doc.data());
                });
    
                setAllUsers(userList)
                setFilteredUser(userList)
            } catch (error) {
                setErr(true)
            }
        }
    };



    // const handleKey = (e) => {
    //     e.code === "Enter" && handleSearch();
    // }


    // To select particular user
    const handleSelect = async (user) => {

        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid

        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                // create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });


                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                });
                dispatch({ type: "CHANGE_USER", payload: user })

            }

        } catch (error) {

        }

        setUserName("");
        setAllUsers([])
        setFilteredUser([])

    }


    // To clear Search bar
    const clearSearch = ()=>{
        setUserName("");
        setAllUsers([])
        setFilteredUser([])

    }



    return (
        <div className="search">
            <div className="searchForm">
                <input type="text" placeholder="Fina a person"
                     onChange={(e)=>handleSearch(e)} value={userName}/>
                <span onClick={clearSearch}>X</span>
            </div>
            {err && <span>User not Found!</span>}
            {filteredUser.map((curruser) => (<div className="userChat" onClick={()=>handleSelect(curruser)}>
                <img src={curruser.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{curruser.displayName}</span>
                </div>
            </div>))}
        </div>
    )
}


export default Search;
