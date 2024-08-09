import React, {useEffect, useState} from "react";
import {
    Card,
    Badge,
    CardBody,
    CardFooter,
    Divider,
    Button,
    Heading,
    Stack,
    Image,
    Text,
    SimpleGrid, useToast, Center, IconButton, Icon, HStack, Box
} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/react'
import {BsFillCartPlusFill,} from "react-icons/bs";
import {AiFillCaretDown, AiFillCaretUp, AiOutlineMinusCircle, AiOutlinePlusCircle} from "react-icons/ai";

function Test() {
    const toast = useToast();
    const [inOrder, setInOrder] = useState([]);
    const [orderBy, setOrderBy] = useState('byID')
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
        fetch('http://localhost:8080/item/orderBy/' + orderBy, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then(setList);
    }, [orderBy]);

    fetch('http://localhost:8080/orders/get-current/' + localStorage.getItem('userID'), {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    }).then(response => response.text()).then(function (text) {
        localStorage.setItem('orderID', text)
    })

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
            <Box height={50} width='100%' marginLeft={2}>
                <HStack spacing={2}>
                    <Heading size={"xs"}>Order by:</Heading>
                    {orderBy === "byID" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byTitle" ? <div>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("byTitleReverse")}>By
                            title <Icon as={AiFillCaretUp}/></Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byTitleReverse" ? <div>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("byID")}>By title <Icon
                            as={AiFillCaretDown}/></Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byCost" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("byCostReverse")}>By
                            cost <Icon as={AiFillCaretUp}/></Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byCostReverse" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("byID")}>By cost <Icon
                            as={AiFillCaretDown}/></Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byPopularity" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button colorScheme={"blue"} width={"140px"} onClick={() => setOrderBy("byPopularityReverse")}>By
                            popularity <Icon as={AiFillCaretUp}/></Button>
                    </div> : null}
                    {orderBy === "byPopularityReverse" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button colorScheme={"blue"} width={"140px"} onClick={() => setOrderBy("byID")}>By
                            popularity <Icon as={AiFillCaretDown}/></Button>
                    </div> : null}

                </HStack>
            </Box>
            <SimpleGrid minChildWidth='220px' spacing='40px' m='10px'>
                {Order.map(({id, title, description, img, cost, count}) => {
                    console.log("Item details - id:", id, "title:", title, "description:", description, "img:", img, "cost:", cost, "count:", count);
                    return (
                        id != null && title != null && description != null && img != null && cost > 0 ? (
                            <Card key={id}>
                                <CardBody>
                                    <Image
                                        src={'http://localhost:8080/item/images/' + id}
                                        alt={title}
                                        borderRadius='lg'
                                    />
                                    <Stack mt='6' spacing='3'>
                                        <Heading size='md'>{title}</Heading>
                                        <Text>{description}</Text>
                                        <Text color='blue.600' fontSize='2xl'>
                                            {cost} ₪
                                        </Text>
                                    </Stack>
                                </CardBody>
                                <Divider/>
                                <CardFooter>
                                    {count > 0 ? (
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
                                            <Badge ml='1' fontSize='1.1em' w='30px' h='30px' colorScheme='gray'
                                                   right='0px' borderRadius='10px'>
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
                                        </Center>
                                    ) : (
                                        <Button variant='ghost' colorScheme='blue' onClick={() => {
                                            handleClick(id, title)
                                        }}>
                                            <Icon as={BsFillCartPlusFill}/>&nbsp;To cart
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ) : (
                            <p key={id}>Empty or invalid item</p>
                        )
                    );
                })}
            </SimpleGrid>

        </ChakraProvider>
    );
}

export default Test;