import Chats from "./Chats";
import Navbar from "./Navbar";
import Search from "./Search";

// To show side bar
const Sidebar=()=>{
    return (
        <div className="sidebar">
            <Navbar/>
            <Search/>
            <Chats/>
        </div>
    )
}


export default Sidebar;
