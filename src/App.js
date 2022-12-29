import './App.css';
import {BrowserRouter, createBrowserRouter, Navigate, Route, RouterProvider, Routes} from "react-router-dom";
import Coffee from "./Coffee";
import Cart from "./Cart";
import Login from "./Login";
import React, {useState} from "react";
import Sidebar from "./SideBar";
import Payment from "./Payment";
import Profile from "./Profile";
import ItemsSettings from "./ItemsSettings";

function App() {
        const [isLoggedIn, setIsLoggedIn] = useState(() => {
            if (localStorage.getItem('isLoggedIn') === 'true') return true
            return false
        });

  return (
    <div className="App">
            <div><BrowserRouter>
            {isLoggedIn ?
                <div style={{display: "grid", gridTemplateColumns: "200px auto",position: "relative", height: "100%", width: "100%"}}>
                    <div><Sidebar setIsLoggedIn={setIsLoggedIn} IsLoggedIn={isLoggedIn}/></div>
                    <div>
                        <Routes>
                            <Route path="/" element={<Coffee />} />
                            <Route path="menu" element={<Coffee />} />
                            <Route path="order" element={<Cart />} />
                            <Route path="payment" element={<Payment />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="itemssettings" element={<ItemsSettings />} />
                            <Route path="*" element={<Navigate to="/"/>} />
                        </Routes>
                    </div></div>:
                    <Routes><Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} IsLoggedIn={isLoggedIn}/>}/><Route path="*" element={<Navigate to="login"/>} /> </Routes>}
            </BrowserRouter></div>
        </div>
  );
}

export default App;
