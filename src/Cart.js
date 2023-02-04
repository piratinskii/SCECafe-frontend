import React, {useEffect, useState} from "react";
import {
    Card,
    CardBody,
    Divider,
    Button,
    Heading,
    Text,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    HStack,
    IconButton,
    VStack,
    Badge, Link, Td, Tfoot, Center, Box
} from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import {AiOutlineDelete} from "react-icons/ai";
import InPrepare from "./Components/inPrepare";


function Cart(){
    const handleClick = (id) => {
        fetch('http://localhost:8080/position/full-remove/' + localStorage.getItem('orderID') + '/' + id, {
            method: 'POST',
            body: '',
            headers: {
                Authorization: localStorage.getItem("token")}
        })
            .then(function (r){
                fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'), {headers: {
                        Authorization: localStorage.getItem("token")}})
                    .then(response => response.json())
                    .then(setList);
            })
    }

    const handleChange = (id, value) => {
        fetch('http://localhost:8080/position/change/' + localStorage.getItem('orderID') + '/' + id + '/' + value, {
            method: 'POST',
            body: '',
            headers: {
                Authorization: localStorage.getItem("token")}
        })
            .then(function (r){
                fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'), {headers: {
                        Authorization: localStorage.getItem("token")}})
                    .then(response => response.json())
                    .then(setList);
            })
    }

    const [list, setList] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'),{headers: {
                Authorization: localStorage.getItem("token")}})
            .then(response => response.json())
            .then(setList);
    }, []);

    const [inProgress, setInProgress] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:8080/orders/in-progress/' + localStorage.getItem('userID'), {headers: {
                Authorization: localStorage.getItem("token")}})
            .then(response => response.json())
            .then(setInProgress);
    }, []);

    let total = 0
    inProgress.forEach(element => {
        total += element.sum
    });

    const toPayment = () => {
        window.location.assign('http://localhost:3000/payment');
    }

    return (
        <ChakraProvider>
            {inProgress.length > 0 && (localStorage.getItem('role') !== 'GUEST' || localStorage.getItem('role') !== 'BARISTA') ?
                <Center marginTop={50}>
                    <VStack>
                        <Heading size={"lg"}>Now preparing</Heading>
                        <TableContainer minW={500} maxW={500}>
                            <Table size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Item</Th>
                                        <Th>Cost</Th>
                                        <Th>Count</Th>
                                        <Th>Sum</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {inProgress.map(({itemID, cost, count, sum, title}, index) =>
                                        <Tr key={index}>
                                            <Td>{index+1}</Td>
                                            <Td>{title}</Td>
                                            <Td>{cost} ₪</Td>
                                            <Td>x{count}</Td>
                                            <Td>{sum} ₪</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Th>Total: {total} ₪</Th>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </TableContainer>
                    </VStack>
                </Center> : <p/>
            }

            {list.length > 0 ?
            <div>
            <VStack spacing='10px' marginTop='50px'>
                <Heading size="lg">New order</Heading>
            {list.map(({itemID, cost, count, sum, title}, index) =>
            <Card key={index} minW={500} maxW={500} borderRadius={10}>
                <CardBody >
                    <HStack justify="space-between">
                        <Text fontSize='xl'>{index + 1}. {title} <Badge ml='1' fontSize='0.8em' w='30px' h='30px' colorScheme='gray' right='0px' borderRadius='10px'>{cost}₪</Badge></Text>
                        <NumberInput size='xs' maxW={16} defaultValue={count} min={1} onChange={evt => handleChange(itemID, evt)}>
                           <NumberInputField />
                           <NumberInputStepper>
                               <NumberIncrementStepper />
                               <NumberDecrementStepper />
                           </NumberInputStepper>
                       </NumberInput>
                        <Text fontSize='xl'>
                        <Badge ml='1' fontSize='0.8em' w='30px' h='30px' colorScheme='gray' right='0px' borderRadius='10px'>{sum}₪</Badge>
                        </Text>
                        <IconButton
                            aria-label='Delete position'
                            as={AiOutlineDelete}
                            size='xs'
                            float='right'
                            onClick={() => {handleClick(itemID)}}
                        />
                    </HStack>
                </CardBody>
            </Card>)}
            </VStack>
            <Button colorScheme='messenger' fontSize='lg' marginTop='20px' right='0px' onClick={() => toPayment()}>Let's buy</Button>
            </div> : <Center><Heading marginTop={12} size={"lg"} minW={500} maxW={500}>That's time to order coffee ;) Let`s see <Link href='http://localhost:3000/' color={"blue"} >
                    menu
                </Link></Heading></Center>}
            {localStorage.getItem("role") === 'BARISTA' ?
                <Box marginLeft={30} marginRight={30}>
                    <Divider marginTop={30} marginBottom={30}/>
                    <InPrepare />
                </Box>: <p></p>}
        </ChakraProvider>
    );
}

export default Cart;