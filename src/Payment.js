import React, {useEffect, useState} from "react";
import {
    Button,
    Heading,
    SimpleGrid,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    HStack,
    VStack,
    Td,
    Tfoot,
    Center,
    ModalOverlay,
    useDisclosure,
    Modal,
    ModalHeader,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    FormLabel,
    FormControl,
    PinInput,
    PinInputField,
    FormHelperText,
    FormErrorMessage,
    Divider,
    useToast
} from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import InputMask from "react-input-mask";
import ReactInputDateMask from "react-input-date-mask"
import * as yup from "yup";


function Payment(){
    const toast = useToast();
    const [list, setList] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'))
            .then(response => response.json())
            .then(setList);
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure()

    let total = 0
    list.forEach(element => {
        total += element.sum
    });

    const [cardHolder, setCardHolder] = useState('Evgeniy Piratinskiy')
    const [cardNumber, setCardNumber] = useState('4217830051700170')
    const [expireTo, setExpireTo] = useState('1227')
    const [cvv, setCVV] = useState('363')
    const [tableNum, setTableNum] = useState('')
    const handleCardHolder = (e) => setCardHolder(e.target.value)
    const handleCardNumber = (e) => setCardNumber(e.target.value)
    const handleExpireTo = (e) => setExpireTo(e.target.value)
    const handleCVV = (e) => setCVV(e.target.value)
    const handleTableNum = (e) => setTableNum(e.target.value)


    const isNoCardHolder = cardHolder === ''
    const isNoCardNumber = cardNumber === ''
    const isNoExpireTo = expireTo === ''
    const isNoCVV = cvv === ''
    const isNoTableNum = tableNum === ''

    return (
        <ChakraProvider>
            <Center marginTop={12}>
                <VStack>
                <Heading size='lg'>Payment</Heading>
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
                        {list.map(({itemID, cost, count, sum, title}, index) =>
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
            </Center>
            <Button colorScheme="blue" onClick={() => {
                onOpen()
            }}>Pay with credit card</Button>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Payment with credit card</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={isNoCardHolder}>
                            <Heading size={"md"}>You have to pay {total} ₪</Heading>
                            <FormLabel marginTop={4}>Card holder:</FormLabel>
                            <Input type='text' onChange={handleCardHolder} value={cardHolder} />
                            {!isNoCardHolder ? (
                                <FormHelperText>
                                    Enter name of card holder.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>Card holder is required.</FormErrorMessage>
                            )}</FormControl>
                            <FormControl isInvalid={isNoCardNumber}>
                                <FormLabel marginTop={4}>Card number:</FormLabel>
                                <Input as={InputMask} mask="9999 9999 9999 9999" maskChar={null} onChange={handleCardNumber} value={cardNumber}/>
                                {!isNoCardNumber ? (
                                    <FormHelperText>
                                        Enter card number.
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Card number is required.</FormErrorMessage>
                                )}</FormControl>
                            <SimpleGrid columns={2} spacing={10} marginTop={4}>
                                <div>
                                    <FormControl isInvalid={isNoExpireTo}>
                                    <FormLabel>Expired to:</FormLabel>
                                    <Input as={InputMask} mask="99/99" maskChar={null}  onChange={handleExpireTo} value={expireTo}/>
                                        {!isNoExpireTo ? (
                                            <FormHelperText>
                                                Enter `expire to` date of card.
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage>`Expire to` is required.</FormErrorMessage>
                                        )}</FormControl>
                                    </div>
                                <div>
                                    <FormLabel float={"right"}>CVV/CVC2:</FormLabel>
                                    <HStack float={"right"}>
                                        <FormControl isInvalid={isNoCVV}>
                                            <Input as={InputMask} mask="999" maskChar={null}  onChange={handleCVV} value={cvv}/>
                                        {!isNoCVV ? (
                                            <FormHelperText>
                                                Enter CVV/CVC2 of card.
                                            </FormHelperText>
                                        ) : (
                                            <FormErrorMessage> CVV/CVC2 is required.</FormErrorMessage>
                                        )}</FormControl>
                                    </HStack>
                                </div>
                            </SimpleGrid>
                        <Divider orientation='horizontal' />
                        <FormControl isInvalid={isNoTableNum} value={tableNum} marginTop={5}>
                            <FormLabel>Please, enter table number:</FormLabel>
                            <Input type='number' onChange={handleTableNum} value={tableNum} ></Input>
                            {!isNoTableNum ? (
                                <FormHelperText>
                                    Enter table number.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage> Table number is required.</FormErrorMessage>
                            )}</FormControl>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={
                            () => {
                                fetch('http://localhost:8080/tables/booking/' + tableNum + '/' + localStorage.getItem('orderID'), {
                                    method: 'POST',
                                    body: ''
                                }).then(response => response.text())
                                    .then(function (text){
                                        if (text === "ok"){
                                            fetch('http://localhost:8080/orders/paid/' + localStorage.getItem("orderID"), {
                                                method: 'POST'
                                            }).then(function (){
                                                fetch('http://localhost:8080/orders/get-current/'+localStorage.getItem('userID')).then(response => response.text()).then(function (text){
                                                    localStorage.setItem('orderID',text)
                                                })
                                                onClose()
                                            })
                                        }
                                        else {
                                            toast({
                                                position: 'bottom-left',
                                                title: 'Oops. You have mistake.',
                                                description: text,
                                                status: 'error',
                                                colorScheme: 'blue',
                                                duration: 5000,
                                                isClosable: true,
                                            })
                                        }
                                    })
                            }
                        } margin={2} colorScheme='blue'>Pay</Button>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
}

export default Payment;