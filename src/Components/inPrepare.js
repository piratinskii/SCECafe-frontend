import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    ChakraProvider,
    Checkbox,
    Divider,
    SimpleGrid,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";

function InPrepare(){

    const [orders,setOrders] = useState([])
    useEffect( () => {
        fetch('http://localhost:8080/orders/preparing', {
            method: 'GET',
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(r => r.json())
            .then(async function (r) {
                await setOrders(r)
            })
    })

    return (
        <ChakraProvider>
            <SimpleGrid minChildWidth={200} spacing={25}>
                {orders.map((order, id) =>{
                    return(
                <Card key={id} alignItems={"start"} >
                    <CardHeader fontSize={"md"} fontWeight={'bold'}>Order #{order.id}</CardHeader>
                    <Divider/>
                    <CardBody>
                        {
                            order["positions"].map((position,id1) =>
                                <VStack key={id1}>
                                    <Checkbox alignSelf={'start'} onChange={(e) => e.target.disabled = true}>{position.item.title}</Checkbox>
                                </VStack>
                        )}
                    </CardBody>
                    <CardFooter>
                        <Button colorScheme='messenger' onClick={() => {
                            fetch('http://localhost:8080/orders/done?id=' + order.id,
                                {
                                    method: "POST",
                                    headers: {
                                        Authorization: localStorage.getItem('token'),
                                    },
                                }).catch(e => console.log(e))
                        }
                        }>Done</Button>
                    </CardFooter>
                </Card>)})}
            </SimpleGrid>
        </ChakraProvider>
    );
}

export default InPrepare;