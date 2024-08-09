import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
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
import Orders from "./Orders";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState("True");

    useEffect(() => {
        fetch("http://localhost:8080/users/isLogged", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then((response) => {
            if (response.ok) {
                setIsLoggedIn("True");
            } else {
                localStorage.clear();
                setIsLoggedIn(null);
            }
        });
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                {isLoggedIn ? (
                    <div style={{display: "grid", gridTemplateColumns: "200px auto", height: "100vh"}}>
                        <div style={{position: "relative"}}>
                            <Sidebar setIsLoggedIn={setIsLoggedIn} IsLoggedIn={isLoggedIn}/>
                        </div>
                        <div style={{overflowY: 'auto', padding: '20px'}}>
                            {localStorage.getItem('role') === 'USER' || localStorage.getItem('role') === 'GUEST' ? (
                                <Routes>
                                    <Route path="/" element={<Coffee/>}/>
                                    <Route path="menu" element={<Coffee/>}/>
                                    <Route path="order" element={<Cart/>}/>
                                    <Route path="payment" element={<Payment/>}/>
                                    <Route path="profile" element={<Profile/>}/>
                                    <Route path="*" element={<Navigate to="menu"/>}/>
                                </Routes>
                            ) : null}
                            {localStorage.getItem('role') === 'ADMIN' ? (
                                <Routes>
                                    <Route path="/" element={<ItemsSettings/>}/>
                                    <Route path="profile" element={<Profile/>}/>
                                    <Route path="itemssettings" element={<ItemsSettings/>}/>
                                    <Route path="*" element={<Navigate to="itemssettings"/>}/>
                                </Routes>
                            ) : null}
                            {localStorage.getItem('role') === 'BARISTA' ? (
                                <Routes>
                                    <Route path="/" element={<Orders/>}/>
                                    <Route path="orders" element={<Orders/>}/>
                                    <Route path="*" element={<Navigate to="orders"/>}/>
                                </Routes>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <Routes>
                        <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} IsLoggedIn={isLoggedIn}/>}/>
                        <Route path="registration" element={<Registration/>}/>
                        <Route path="welcome" element={<Welcome/>}/>
                        <Route path="*" element={<Navigate to="welcome"/>}/>
                    </Routes>
                )}
            </BrowserRouter>
        </div>
    );
}

export default App;
