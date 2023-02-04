import './App.css';
import {BrowserRouter, createBrowserRouter, Navigate, Route, RouterProvider, Routes} from "react-router-dom";
import Coffee from "./Coffee";
import Cart from "./Cart";
import Login from "./Login";
import React, {useEffect, useState} from "react";
import Sidebar from "./SideBar";
import Payment from "./Payment";
import Profile from "./Profile";
import ItemsSettings from "./ItemsSettings";
import Registration from "./Registration";
import Welcome from "./Welcome";
import {tokenToCSSVar} from "@chakra-ui/react";
import InPrepare from "./Components/inPrepare";

function App() {
        const [isLoggedIn, setIsLoggedIn] = useState("True");
        useEffect(() => {
            const res = fetch("http://localhost:8080/users/isLogged",{
                headers: {
                    Authorization: localStorage.getItem("token")}
            }).then((response) => {
                if (response.ok) setIsLoggedIn("True"); else {
                    localStorage.setItem('baristaID', null);
                    localStorage.setItem('username', null);
                    localStorage.setItem('orderID', null)
                    localStorage.setItem('userID', null);
                    localStorage.setItem('token', null);
                    localStorage.setItem('role', null);
                    setIsLoggedIn(null);
                    };
            })})



  return (
    <div className="App">
            <div><BrowserRouter>
            {isLoggedIn ?
                <div style={{display: "grid", gridTemplateColumns: "200px auto",position: "relative", height: "100%", width: "100%"}}>
                    <div><Sidebar setIsLoggedIn={setIsLoggedIn} IsLoggedIn={isLoggedIn}/></div>
                    <div>
                        {localStorage.getItem('role') === 'USER' || localStorage.getItem('role') === 'BARISTA'  ?
                            <Routes>
                                <Route path="/" element={<Coffee />} />
                                <Route path="menu" element={<Coffee />} />
                                <Route path="order" element={<Cart />} />
                                <Route path="payment" element={<Payment />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="*" element={<Navigate to="menu"/>} />
                            </Routes> : <p/>}
                            {
                                localStorage.getItem('role') === 'ADMIN' ?
                                    <Routes>
                                        <Route path="/" element={<ItemsSettings />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="itemssettings" element={<ItemsSettings />} />
                                        <Route path="*" element={<Navigate to="itemssettings"/>} />
                                    </Routes> : <p/>
                            }
                            {
                                localStorage.getItem('role') === 'GUEST' ?
                                    <Routes>
                                        <Route path="/" element={<Coffee />} />
                                        <Route path="menu" element={<Coffee />} />
                                        <Route path="order" element={<Cart />} />
                                        <Route path="payment" element={<Payment />} />
                                        <Route path="*" element={<Navigate to="menu"/>} />
                                    </Routes> : <p/>
                            }
                    </div></div>:
                    <Routes>
                        <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} IsLoggedIn={isLoggedIn}/>}/>
                        <Route path="registration" element={<Registration/>} />
                        <Route path="welcome" element={<Welcome/>} />
                        <Route path="*" element={<Navigate to="welcome"/>} />
                    </Routes>}
            </BrowserRouter></div>
        </div>
  );
}

export default App;
