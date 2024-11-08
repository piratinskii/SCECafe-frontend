import React, {useEffect, useState} from "react";
import {
    Card,
    CardHeader,
    Badge,
    CardBody,
    CardFooter,
    Divider,
    Button,
    ButtonGroup,
    Heading,
    Stack,
    Image,
    Text,
    SimpleGrid, useToast, Center, IconButton, Icon, HStack
} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/react'
import {BsFillCartPlusFill,} from "react-icons/bs";
import {AiOutlineMinusCircle, AiOutlinePlusCircle} from "react-icons/ai";
import OrderByBar from "./OrderByBar";

function ByID() {
    const toast = useToast();
    const [inOrder, setInOrder] = useState([]);
    const [update, setUpdate] = useState(0);
    useEffect(() => {
        fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then(setInOrder);
    }, []);
    const handleClick = (id, title) => {
        fetch('http://localhost:8080/position/add/' + localStorage.getItem('orderID') + '/' + id, {
            method: 'POST',
            body: '',
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(function (r) {
                toast({
                    position: 'bottom-left',
                    title: 'Item added.',
                    description: title + ' is now in the cart',
                    status: 'success',
                    colorScheme: 'blue',
                    duration: 1000,
                    isClosable: true,
                })
                fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'), {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                    .then(response => response.json())
                    .then(setInOrder);
            })
    }
    const handleClickRemove = (id, title) => {
        fetch('http://localhost:8080/position/remove/' + localStorage.getItem('orderID') + '/' + id, {
            method: 'POST',
            body: '',
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(function (r) {
                toast({
                    position: 'bottom-left',
                    title: 'Item removed.',
                    description: title + ' removed from the cart',
                    status: 'warning',
                    colorScheme: 'blue',
                    duration: 1000,
                    isClosable: true,
                })
                fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'), {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                    .then(response => response.json())
                    .then(setInOrder);
            })
    }

    const [list, setList] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/item', {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then(setList);
    }, []);

    fetch('http://localhost:8080/orders/get-current/' + localStorage.getItem('userID'), {
        headers: {
            Authorization: localStorage.getItem("token")
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

    return (
        <ChakraProvider>
            <OrderByBar/>
            <SimpleGrid minChildWidth='220px' spacing='40px' m='10px'>
                {Order.map(({id, title, description, img, cost, count}, index) =>
                    id != null && title != null && description != null && img != null && cost > 0 ?
                        <Card key={index}>
                            <CardBody>
                                <Image
                                    src={'http://localhost:8080/item/images/' + id}
                                    alt={title}
                                    borderRadius='lg'
                                />
                                <Stack mt='6' spacing='3'>
                                    <Heading size='md'>{title}</Heading>
                                    <Text>
                                        {description}
                                    </Text>
                                    <Text color='blue.600' fontSize='2xl'>
                                        {cost} ₪
                                    </Text>
                                </Stack>
                            </CardBody>
                            <Divider/>
                            <CardFooter>
                                {count > 0 ?
                                    <Center width='100%'>
                                        <IconButton
                                            aria-label='Remove position'
                                            as={AiOutlineMinusCircle}
                                            size='xs'
                                            marginLeft='10px'
                                            onClick={() => {
                                                handleClickRemove(id, title)
                                            }}
                                        />
                                        <Badge ml='1' fontSize='1.1em' w='30px' h='30px' colorScheme='gray' right='0px'
                                               borderRadius='10px'>
                                            {count}
                                        </Badge>
                                        <IconButton
                                            aria-label='Add position'
                                            as={AiOutlinePlusCircle}
                                            size='xs'
                                            marginLeft='10px'
                                            onClick={() => {
                                                handleClick(id, title)
                                            }}
                                        />
                                    </Center> :
                                    <Button variant='ghost' colorScheme='blue' onClick={() => {
                                        handleClick(id, title)
                                    }}>
                                        <Icon as={BsFillCartPlusFill}/>&nbsp;To cart
                                    </Button>}
                            </CardFooter>
                        </Card> : <p/>)}
            </SimpleGrid>
        </ChakraProvider>
    );
}

export default ByID;