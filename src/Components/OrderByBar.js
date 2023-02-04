import {Box, Button, ChakraProvider, Heading, HStack, Icon} from "@chakra-ui/react";
import {AiFillCaretDown, AiFillCaretUp} from "react-icons/ai";
import {useState} from "react";


function OrderByBar(){
    const [orderBy, setOrderBy] = useState('')

    return (
        <ChakraProvider>
            <Box height={50} width='100%' marginLeft={2}>
                <HStack spacing={2}>
                    <Heading size={"xs"}>Order by:</Heading>
                    {orderBy === "" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")} >By title </Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byTitle" ? <div>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("byTitleReverse")}>By title <Icon as={AiFillCaretUp} /></Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byTitleReverse" ? <div>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("")}>By title <Icon as={AiFillCaretDown} /></Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byCost" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("byCostReverse")}>By cost <Icon as={AiFillCaretUp} /></Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byCostReverse" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button colorScheme={"blue"} width={"100px"} onClick={() => setOrderBy("")}>By cost <Icon as={AiFillCaretDown} /></Button>
                        <Button width={"140px"} onClick={() => setOrderBy("byPopularity")}>By popularity </Button>
                    </div> : null}
                    {orderBy === "byPopularity" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button colorScheme={"blue"} width={"140px"} onClick={() => setOrderBy("byPopularityReverse")}>By popularity <Icon as={AiFillCaretUp} /></Button>
                    </div> : null}
                    {orderBy === "byPopularityReverse" ? <div>
                        <Button width={"100px"} onClick={() => setOrderBy("byTitle")}>By title </Button>
                        <Button width={"100px"} onClick={() => setOrderBy("byCost")}>By cost </Button>
                        <Button colorScheme={"blue"} width={"140px"} onClick={() => setOrderBy("")}>By popularity <Icon as={AiFillCaretDown} /></Button>
                    </div> : null}

                    </HStack>
            </Box>
        </ChakraProvider>
    )
}


export default OrderByBar;