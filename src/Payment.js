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
    FormHelperText,
    FormErrorMessage,
    Divider,
    useToast, Box
} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/react'
import InputMask from "react-input-mask";


function Payment() {
    const toast = useToast();
    const [list, setList] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/orders/' + localStorage.getItem('orderID'), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then(setList);
    }, []);

    const {isOpen, onOpen, onClose} = useDisclosure()
    const {isOpen: isOpenCash, onOpen: onOpenCash, onClose: onCloseCash} = useDisclosure()
    const {isOpen: isOpenFinal, onOpen: onOpenFinal, onClose: onCloseFinal} = useDisclosure()
    let total = 0
    list.forEach(element => {
        total += element.sum
    });

    const [cardHolder, setCardHolder] = useState('Evgeniy Piratinskiy')
    const [cardNumber, setCardNumber] = useState('4217830051700170')
    const [expireTo, setExpireTo] = useState('1227')
    const [cvv, setCVV] = useState('363')
    const [clientNumber, setClientNumber] = useState('')
    const handleCardHolder = (e) => setCardHolder(e.target.value)
    const handleCardNumber = (e) => setCardNumber(e.target.value)
    const handleExpireTo = (e) => setExpireTo(e.target.value)
    const handleCVV = (e) => setCVV(e.target.value)
    const handleClientNumber = (e) => setClientNumber(e.target.value)


    const isNoCardHolder = cardHolder === ''
    const isNoCardNumber = cardNumber === ''
    const isNoExpireTo = expireTo === ''
    const isNoCVV = cvv === ''
    const isIncorrectClientNumber = Boolean((clientNumber.length < 13) & (clientNumber.length !== 0))
    const [currentlyPaid, setCurrentlyPaid] = useState(localStorage.getItem('orderID'))

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
                                        <Td>{index + 1}</Td>
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
            <Box marginTop={4}>
                <Button colorScheme="blue" onClick={() => {
                    onOpen()
                }}>Pay with credit card</Button>
                {localStorage.getItem('role') === 'BARISTA' ?
                    <Button marginLeft={4} colorScheme="blue" onClick={() => {
                        onOpenCash()
                    }}>Pay with cash</Button> : <p/>}
            </Box>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Payment with credit card</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl isInvalid={isNoCardHolder}>
                            <Heading size={"md"}>You have to pay {total} ₪</Heading>
                            <FormLabel marginTop={4}>Card holder:</FormLabel>
                            <Input type='text' onChange={handleCardHolder} value={cardHolder}/>
                            {!isNoCardHolder ? (
                                <FormHelperText>
                                    Enter name of card holder.
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>Card holder is required.</FormErrorMessage>
                            )}</FormControl>
                        <FormControl isInvalid={isNoCardNumber}>
                            <FormLabel marginTop={4}>Card number:</FormLabel>
                            <Input as={InputMask} mask="9999 9999 9999 9999" maskChar={null} onChange={handleCardNumber}
                                   value={cardNumber}/>
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
                                    <Input as={InputMask} mask="99/99" maskChar={null} onChange={handleExpireTo}
                                           value={expireTo}/>
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
                                        <Input as={InputMask} mask="999" maskChar={null} onChange={handleCVV}
                                               value={cvv}/>
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
                        <Divider orientation='horizontal'/>
                        {localStorage.getItem('role') === "BARISTA" ?
                            <FormControl isInvalid={isIncorrectClientNumber} marginTop={4}>
                                <FormLabel>Client phone number</FormLabel>
                                <Input as={InputMask} mask="999 999 99 99" maskChar={null} onChange={handleClientNumber}
                                       value={clientNumber} placeholder='Phone number'/>
                                {!isIncorrectClientNumber ? (
                                    <FormHelperText>
                                        Enter client phone number, if it need
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage> Client phone number is incorrect.</FormErrorMessage>
                                )}
                            </FormControl> : <p/>}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={
                            () => {
                                let orderingUser = null
                                if (clientNumber.length === 13) {
                                    fetch('http://localhost:8080/users/findbyphone?phoneNumber=' + clientNumber, {
                                        headers: {
                                            Authorization: localStorage.getItem('token')
                                        }
                                    })
                                        .then(response => response.json())
                                        .then(function (json) {
                                            orderingUser = json['id']
                                        }).catch((e) =>
                                        toast({
                                            title: 'User with this number not exist.',
                                            status: 'error',
                                            duration: 3000,
                                            position: 'bottom-right',
                                            isClosable: true
                                        })
                                    )
                                }
                                if (orderingUser === null) orderingUser = localStorage.getItem('userID')

                                fetch('http://localhost:8080/orders/paid', {
                                    method: 'POST',
                                    headers: {
                                        Authorization: localStorage.getItem("token"),
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        'id': localStorage.getItem('orderID'),
                                        'baristaID': localStorage.getItem('baristaID'),
                                        'userID': orderingUser
                                    })
                                }).then(function () {
                                    fetch('http://localhost:8080/orders/get-current/' + localStorage.getItem('userID'), {
                                        headers: {
                                            Authorization: localStorage.getItem("token")
                                        }
                                    }).then(response => response.text()).then(function (text) {
                                        localStorage.setItem('orderID', text)
                                    })
                                    onClose()
                                    if (localStorage.getItem("role") !== 'BARISTA') onOpenFinal()
                                    if (localStorage.getItem("role") === 'BARISTA') toast({
                                        position: 'bottom-left',
                                        title: 'Order has been paid',
                                        description: 'Order ' + currentlyPaid + ' is accepted.',
                                        status: 'info',
                                        colorScheme: 'blue',
                                        duration: 4000,
                                        isClosable: true,
                                    })
                                })
                            }
                        } margin={2} colorScheme='blue'>Pay</Button>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isCentered isOpen={isOpenCash} onClose={onCloseCash}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Payment with cash</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px',
                        }}>
                            <Heading size={"4xl"}>{total} ₪</Heading>
                        </div>
                        <FormControl isInvalid={isIncorrectClientNumber} marginTop={4}>
                            <FormLabel>Client phone number</FormLabel>
                            <Input as={InputMask} mask="999 999 99 99" maskChar={null} onChange={handleClientNumber}
                                   value={clientNumber} placeholder='Phone number'/>
                            {!isIncorrectClientNumber ? (
                                <FormHelperText>
                                    Enter client phone number, if it need
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage> Client phone number is incorrect.</FormErrorMessage>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={
                            () => {
                                let orderingUser = null
                                if (clientNumber !== null) {
                                    fetch('http://localhost:8080/users/findbyphone?phoneNumber=' + clientNumber, {
                                        headers: {
                                            Authorization: localStorage.getItem('token')
                                        }
                                    })
                                        .then(response => response.json())
                                        .then(function (json) {
                                            orderingUser = json['id']
                                        }).catch((e) =>
                                        toast({
                                            title: 'User with this number not exist.',
                                            status: 'error',
                                            duration: 3000,
                                            position: 'bottom-right',
                                            isClosable: true
                                        })
                                    )
                                }
                                if (orderingUser === null) orderingUser = localStorage.getItem('userID')

                                fetch('http://localhost:8080/orders/paid', {
                                    method: 'POST',
                                    headers: {
                                        Authorization: localStorage.getItem("token"),
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        'id': localStorage.getItem('orderID'),
                                        'baristaID': localStorage.getItem('baristaID'),
                                        'userID': orderingUser
                                    })
                                }).then(function () {
                                    fetch('http://localhost:8080/orders/get-current/' + localStorage.getItem('userID'), {
                                        headers: {
                                            Authorization: localStorage.getItem("token")
                                        }
                                    }).then(response => response.text()).then(function (text) {
                                        localStorage.setItem('orderID', text)
                                    })
                                    onCloseCash()
                                    if (localStorage.getItem("role") !== 'BARISTA') onOpenFinal()
                                    if (localStorage.getItem("role") === 'BARISTA') toast({
                                        position: 'bottom-left',
                                        title: 'Order has been paid',
                                        description: 'Order ' + currentlyPaid + ' is accepted.',
                                        status: 'info',
                                        colorScheme: 'blue',
                                        duration: 4000,
                                        isClosable: true,
                                    })
                                })
                            }
                        } margin={2} colorScheme='blue'>Pay</Button>
                        <Button onClick={onCloseCash}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isCentered size='3xl' isOpen={isOpenFinal} onClose={onCloseFinal}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />
                <ModalContent height={'60%'}>
                    <ModalHeader marginTop={"20%"}></ModalHeader>
                    <ModalCloseButton onClick={() => {
                        onCloseFinal();
                        localStorage.setItem("token", null);
                        window.location.assign('http://localhost:3000/')
                    }}/>
                    <ModalBody>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px',
                        }}>
                            <VStack>
                                <Heading>Your order:</Heading>
                                <Heading size={"4xl"}>{currentlyPaid}</Heading>
                                <Heading>Enjoy best coffee ever!</Heading>
                            </VStack>
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
}

export default Payment;