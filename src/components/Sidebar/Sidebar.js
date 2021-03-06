import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton, Avatar } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "../SidebarChat/SidebarChat_";
import MenuProfile from "../menuProfile";
import {useSelector} from "react-redux"



const Sidebar = (props) => {
  const user = useSelector((state) => state.auth);
  const menu = useRef(null);
  useOutsideAlerter(menu);
  const [conversations,setConversations]= useState([]);
  let selector=0;
  function useOutsideAlerter(ref) {
    useEffect(() => {
    
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.closeMenu();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

useEffect(()=>{

  const getConversations = async() => {
    try {
      const res = await fetch('https://academlo-whats.herokuapp.com/api/v1/users/1/conversations')
      const response = await res.json();
      //console.log(idToSearch);
      const activeConversations= await response.filter(element=>{
        
          return(
            element.members[0]===props.id||element.members[1]===props.id
          )
          // if(element.members[0]===props.id||element.members[1]===props.id){
          //     //console.log(element);
          //     return(element);
          // }
          
      })
      //console.log(activeConversations);
      setConversations(activeConversations);
    } 
    catch (error) {
      console.log(error)
    }
  }
  getConversations();

},[props.id]);

  return (

    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={`${user.user.photoURL}`} />
        <h4>{`${user.user.displayName}`}</h4>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton onClick={props.newchat}>
            <ChatIcon />
          </IconButton>
          <div ref={menu} className="dropdown_menu">
            <div>
              <MoreVertIcon onClick={props.showMenu} />
            </div>
            {props.closeM ? null : <MenuProfile />}
          </div>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Busca o inicia un nuevo chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
      {
            conversations.map((element,index)=>{
              element.membersObj[0]._id===props.id?selector=1:selector=0
              return(
                <SidebarChat key={index} name={element.membersObj[selector].username}  photo={element.membersObj[selector].photoUrl} conversation={element} selectConversation={props.selectConversation} selector={selector}/>
              )
          })
        }
        
        {/* <SidebarChat />
        <SidebarChat /> */}
      </div>
    </div>

    
  );
};

export default Sidebar;