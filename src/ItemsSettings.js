import React, {useEffect, useState} from "react";
import {
    Card,
    CardBody,
    Stack,
    Image,
    Text,
    SimpleGrid, useToast, Center, IconButton, Icon, Input, HStack, Box, CardHeader, VStack, Button
} from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import {TiDelete, TiDeleteOutline} from "react-icons/ti";
import {AiOutlineCloudUpload} from "react-icons/ai";
import Dropzone, {useDropzone} from "react-dropzone";

function ItemsSettings(){
    

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };

    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const toast = useToast();
    const [inOrder, setInOrder] = useState([]);
    const [update, setUpdate] = useState(0);
    useEffect(()=>{
        fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'))
            .then(response => response.json())
            .then(setInOrder);
    }, []);

    const handleClick = (id, title) => {
        fetch('http://localhost:8080/position/add/' + localStorage.getItem('orderID') + '/' + id, {
            method: 'POST',
            body: ''
        })
            .then(function (r){
                toast({
                    position: 'bottom-left',
                    title: 'Item added.',
                    description: title + ' is now in the cart',
                    status: 'success',
                    colorScheme: 'blue',
                    duration: 1000,
                    isClosable: true,
                })
                fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'))
                    .then(response => response.json())
                    .then(setInOrder);
            })
    }
    const handleClickRemove = (id, title) => {
        fetch('http://localhost:8080/position/remove/' + localStorage.getItem('orderID') + '/' + id, {
            method: 'POST',
            body: ''
        })
            .then(function (r){
                toast({
                    position: 'bottom-left',
                    title: 'Item removed.',
                    description: title + ' removed from the cart',
                    status: 'warning',
                    colorScheme: 'blue',
                    duration: 1000,
                    isClosable: true,
                })
                fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'))
                    .then(response => response.json())
                    .then(setInOrder);
            })
    }

    const [list, setList] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:8080/item')
            .then(response => response.json())
            .then(setList);
    }, []);

    fetch('http://localhost:8080/orders/get-current/'+localStorage.getItem('userID')).then(response => response.text()).then(function (text){
        localStorage.setItem('orderID',text)
    })

    //Onion this arrays
    let Order = [];
    list.forEach(element =>
    {
        let OrdPosition = new Object();
        OrdPosition['id'] = element.id
        OrdPosition['title'] = element.title
        OrdPosition['description'] = element.description
        OrdPosition['img'] = element.img
        OrdPosition['cost'] = element.cost
        inOrder.forEach(inOrd =>
        {
            if (inOrd.itemID == element.id)
                OrdPosition['count']=inOrd.count
        })
        Order.push(OrdPosition)
    })

    return (
        <ChakraProvider>
            <SimpleGrid minChildWidth='220px' spacing='40px' m='10px'>
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
                                onClick={() => {}}
                            />
                        </CardHeader>
                        <CardBody >
                            <Image
                                src={img}
                                alt={title}
                                borderRadius='lg'
                            />
                            <Stack mt='6' spacing='3'>
                                <Input fontWeight='bold' defaultValue={title}></Input>
                                <Input type='text' defaultValue={description}/>
                                <HStack><Input type='number' color='blue' fontSize='2xl' defaultValue={cost}/><Text color='blue' fontSize='2xl'> ₪</Text> </HStack>

                            </Stack>
                        </CardBody>
                    </Card>)}
                <Card>
                    <CardHeader height={0}>

                    </CardHeader>
                    <CardBody >
                        <VStack>
                            <Box>
                            {/*Here will be files upload*/}
                            </Box>
                        </VStack>
                        <Stack mt='6' spacing='3' marginTop={5}>
                            <Input fontWeight='bold' placeholder='Item title'></Input>
                            <Input type='text' placeholder='Item description'/>
                            <HStack><Input type='number' color='blue' fontSize='2xl' placeholder='Item cost'/><Text color='blue' fontSize='2xl'> ₪</Text> </HStack>
                        </Stack>
                    </CardBody>
                </Card>
                </SimpleGrid>
            </ChakraProvider>
    );
}

export default ItemsSettings;