import React, {useEffect, useState} from "react";
import {
    Heading,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Tfoot,
    Center,
    VStack,
    Box,
    Divider
} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/react';
import InPrepare from "./Components/inPrepare";

function Orders() {
    const [inProgress, setInProgress] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/orders/in-progress/' + localStorage.getItem('userID'), {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then(setInProgress);
    }, []);

    let total = 0;
    inProgress.forEach(element => {
        total += element.sum;
    });

    return (
        <ChakraProvider>
            {inProgress.length > 0 ? (
                <Center marginTop={50}>
                    <VStack>
                        <Heading size={"lg"}>Orders in Progress</Heading>
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
            ) : <p/>}

            <Box marginLeft={30} marginRight={30}>
                <Divider marginTop={30} marginBottom={30}/>
                <InPrepare/>
            </Box>
        </ChakraProvider>
    );
}

export default Orders;
