import React, {useEffect, useState} from "react";
import {
    Card,
    CardBody,
    Stack,
    Image,
    Text,
    SimpleGrid, useToast, IconButton, Input, HStack, CardHeader, CardFooter
} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/react'
import {TiDeleteOutline} from "react-icons/ti";
import {AddIcon} from "@chakra-ui/icons";


function ItemsSettings() {

    const toast = useToast();

    const [hover, setHover] = useState(false);
    const addItemStyle = {
        background: hover ? '#f9f9ff' : '#ffffff'
    }
    const [inOrder, setInOrder] = useState([]);
    const [update, setUpdate] = useState(false);
    useEffect(() => {
        fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'),
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(setInOrder);
    }, []);


    const handleClickRemove = (id) => {
        const formData = new FormData();
        formData.set('id', id)
        fetch('http://localhost:8080/item/remove', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(function () {
                window.location.reload()
            })
    }

    const [list, setList] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/item', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(setList);
    }, []);

    fetch('http://localhost:8080/orders/get-current/' + localStorage.getItem('userID'), {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(response => response.text()).then(function (text) {
        localStorage.setItem('orderID', text)
    })

    //Onion this arrays
    let Order = [];
    list.forEach(element => {
        let OrdPosition = new Object();
        OrdPosition['id'] = element.id
        OrdPosition['title'] = element.title
        OrdPosition['description'] = element.description
        OrdPosition['img'] = element.img
        OrdPosition['cost'] = element.cost
        inOrder.forEach(inOrd => {
            if (inOrd.itemID == element.id)
                OrdPosition['count'] = inOrd.count
        })
        Order.push(OrdPosition)
    })

    function uploadFile(event, id) {
        const imgFile = event.target.files[0];
        console.log(id)
        const formData = new FormData();
        formData.set('File', imgFile);
        formData.set('id', id)
        console.log(event.target.files[0])
        fetch('http://localhost:8080/item/images/upload', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(data => console.log(data))
            .catch(err => console.log(err))
        setUpdate(!update)
        window.location.reload();
    }

    function saveItem(id, title, desc, cost) {
        const formData = new FormData();
        if (title == null) title = '';
        if (desc == null) desc = '';
        if (cost == null) cost = '';
        formData.set('id', id);
        formData.set('title', title)
        formData.set('desc', desc);
        formData.set('cost', cost)
        fetch('http://localhost:8080/item/edit', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then()
        window.location.reload();
    }

    return (
        <ChakraProvider>
            <SimpleGrid minChildWidth='220px' minHeight='800px' spacing='40px' m='10px'>
                {Order.map(({id, title, description, img, cost, count}, index) =>
                    <Card key={index}>
                        <CardHeader height={0}>
                            <IconButton
                                aria-label='Delete item'
                                as={TiDeleteOutline}
                                float={"right"}
                                size='sm'
                                marginRight={-9}
                                color={"red"}
                                bgColor={"white"}
                                onClick={() => {
                                    handleClickRemove(id)
                                }}
                            />
                        </CardHeader>
                        <CardBody>
                            <label htmlFor={'uploadFileBtn' + id}>
                                <Image
                                    src={'http://localhost:8080/item/images/' + id}
                                    alt={title}
                                    borderRadius='lg'
                                />
                            </label>
                            <Input type='file' display='none' id={'uploadFileBtn' + id} onChange={(e) => {
                                uploadFile(e, id)
                            }} accept={'.jpg,.png'}/>
                            <Stack mt='6' spacing='3'>
                                <Input fontWeight='bold' defaultValue={title} placeholder="New title" onBlur={(e) => {
                                    saveItem(id, e.target.value, description, cost)
                                }}></Input>
                                <Input type='text' defaultValue={description} placeholder="New description"
                                       onBlur={(e) => {
                                           saveItem(id, title, e.target.value, cost)
                                       }}/>
                                <HStack><Input type='number' color='blue' fontSize='2xl' defaultValue={cost}
                                               onBlur={(e) => {
                                                   saveItem(id, title, description, e.target.value)
                                               }}/><Text color='blue' fontSize='2xl'> ₪</Text> </HStack>
                            </Stack>
                        </CardBody>
                        <CardFooter/>
                    </Card>)}
                <Card minHeight={500} onClick={() => {
                    fetch('http://localhost:8080/item', {
                        method: 'POST',
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    }).then()
                    window.location.reload();
                }} style={addItemStyle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    <CardHeader/>
                    <CardBody display={'flex'}
                              alignItems={'center'}
                              justifyContent={'center'}>
                        <AddIcon color={'blue'} boxSize={'3em'}/>
                    </CardBody>
                    <CardFooter/>
                </Card>
            </SimpleGrid>
        </ChakraProvider>
    );
}

export default ItemsSettings;