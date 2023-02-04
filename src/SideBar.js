import {Flex, WrapItem} from '@chakra-ui/layout'
import {Button, ChakraProvider, Heading, Icon, SimpleGrid, Spinner, Stack, Tag} from "@chakra-ui/react";
import { Avatar, Image, Text, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import React, {useEffect, useState} from "react";
import {BsCartCheck} from "react-icons/bs";
import {BiExit, BiFoodMenu} from "react-icons/bi";
import {CiSettings} from "react-icons/ci";

fetch('http://localhost:8080/users/getusername/' + localStorage.getItem("userID"), {headers: {
        Authorization: localStorage.getItem("token")}})
    .then(response => response.text())
    .then(function (text){
        localStorage.setItem("username", text)
    })
const toMenu = () => {
        window.location.assign('http://localhost:3000/menu');
    }

const toOrder = () => {
    window.location.assign('http://localhost:3000/order');
}

const toProfile = () => {
    window.location.assign('http://localhost:3000/profile');
}

const itemsSettings = () => {
    window.location.assign('http://localhost:3000/itemssettings')
}

function Sidebar(props) {
    const logout = () => {
        localStorage.setItem('token', null);
        window.location.assign('http://localhost:3000/')
    }

    const role = localStorage.getItem('role')
    let helloWords = Array ('Nice to see you, ','Have a good day, ','You relly need coffee, ','WOW! It`s you , ')
    return (
        <ChakraProvider>
            <Tag borderRadius='25px' marginLeft='-30px' colorScheme='blue' onClick={() => {
                if (role === 'USER' || role === 'ADMIN')
                    toProfile()
            }}>
            <Heading as='h2' size='md' margin='10px'>
                {helloWords[Math.floor(Math.random()*helloWords.length)]}{localStorage.getItem("username")}!
            </Heading>
            </Tag>
            <Stack direction='column' spacing={2} align='center' m="20px" marginLeft="-10px">
                {role === 'USER' || role === 'GUEST' || role === 'BARISTA' ? <div>
                <Button colorScheme='blue' variant='outline' w="200px" onClick={() => {
                    toMenu()
                }}>
                    <Icon as={BiFoodMenu}/>&nbsp;Menu
                </Button>
                <Button marginTop={2} colorScheme='blue' variant='outline' w="200px" onClick={() => {
                    toOrder()
                }}>
                    <Icon as={BsCartCheck}/>&nbsp;Cart
                </Button>

             </div> :
                role === 'ADMIN' ? <div>
                    <Button marginTop={-3} colorScheme='blue' variant='outline' w="200px" onClick={() => {
                        itemsSettings()
                    }}>
                        <Icon as={CiSettings}/>&nbsp;Item`s settings
                    </Button>
                </div> : role === 'BARISTA' ? <div>

                </div> : <Heading size={'lg'}>Houston, we have a problems</Heading>}
            <Button marginTop={-3} colorScheme='blue' variant='outline' w="200px" onClick={() => {
                logout()
            }}>
                <Icon as={BiExit}/>&nbsp;Exit
            </Button></Stack>
        </ChakraProvider>

    )
}

export default Sidebar