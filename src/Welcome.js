import React from "react";
import {
    Button,
    VStack,
    Image,
} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/react'

const logo = 'logo.png';


function Welcome() {
    return (
        <ChakraProvider>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <VStack>
                    <Image
                        w='10%'
                        margin='auto'
                        src={logo}
                        alt='SCE Cafe'
                    />
                    <Button size={'lg'} w={250} h={75} onClick={() => {
                        fetch('http://localhost:8080/login',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': "application/json"
                                },
                                body: JSON.stringify({
                                    username: "guest",
                                    password: "guest"
                                })
                            })
                            .then(function (response) {
                                return response.json()
                            })
                            .then(function (json) {
                                console.log(json)
                                localStorage.setItem('token', 'Bearer_' + json['token'])
                                console.log('Received JWT Token:', json['token']);
                                fetch('http://localhost:8080/orders/get-current/' + json['userID'], {
                                    headers: {
                                        Authorization: 'Bearer_' + json["token"]
                                    }
                                }).then(async response => await response.text()).then(async function (text) {
                                    await localStorage.setItem('orderID', text)
                                    await fetch('http://localhost:8080/orders/clear?id=' + text,
                                        {
                                            method: 'POST',
                                            headers: {
                                                Authorization: localStorage.getItem('token')
                                            }
                                        }).then(r => {
                                    })
                                })
                                return [json['token'], json['userID'], json['role']]
                            })
                            .then(async function (token) {
                                localStorage.setItem('token', "Bearer_" + token[0]);
                                localStorage.setItem('userID', token[1]);
                                localStorage.setItem('role', '' + token[2])
                                await fetch('http://localhost:8080/users/getusername/' + token[1], {
                                    headers: {
                                        Authorization: localStorage.getItem("token")
                                    }
                                })
                                    .then(response => response.text())
                                    .then(function (text) {
                                        localStorage.setItem("username", text)
                                    })
                            })
                            .then(function () {
                                window.location.assign('http://localhost:3000/')
                            })
                    }
                    }>Order as guest</Button>
                    <Button size={'lg'} w={250} h={75} bgColor={"green.100"} onClick={() => {
                        window.location.assign('http://localhost:3000/login');
                    }
                    }>Login</Button>
                    <Button size={'lg'} w={250} h={75} bgColor={"red.100"} onClick={() => {
                        window.location.assign('http://localhost:3000/registration');
                    }}>Registration</Button>
                </VStack>
            </div>
        </ChakraProvider>
    );
}

export default Welcome;