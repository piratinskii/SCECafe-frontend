import React, {useState} from 'react';
import {
    Box,
    Button,
    Center,
    ChakraProvider,
    FormControl, FormErrorMessage,
    FormLabel,
    Image,
    Input, useToast
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import * as yup from 'yup';

const logo = 'logo.png';
const validationSchema = yup.object().shape({
    login: yup.string().required('Login is required!'),
    password: yup.string().required('Password is required!'),
});


function Login(props) {
    const [response, setResponse] = useState({})
    const toast = useToast();
    return (
        <ChakraProvider>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh',
                }}>
                <Box boxSize='20%'>
                    <Image
                        w='70%'
                        margin='auto'
                        src={logo}
                        alt='SCE Cafe'
                    />
                    <Formik initialValues={{login: '', password: ''}} validationSchema={validationSchema}
                            onSubmit={(values, actions) => {
                                setTimeout(async () => {
                                    actions.setSubmitting(false)
                                    console.log('Login: ' + values.login + ' Password' + values.password)
                                    fetch('http://localhost:8080/login',
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': "application/json",
                                            },
                                            body: JSON.stringify({
                                                username: values.login,
                                                password: values.password
                                            })
                                        })
                                        .then(function (response) {
                                            return response.json()
                                        })
                                        .then(function (json) {
                                            return [json['token'], json['userID'], json['role']]
                                        })
                                        .then(await async function (token) {
                                            localStorage.setItem('token', "Bearer_" + token[0]);
                                            localStorage.setItem('userID', token[1]);
                                            localStorage.setItem('role', '' + token[2])
                                            if (token[2] === 'BARISTA')
                                                localStorage.setItem('baristaID', token[1]);
                                            await fetch('http://localhost:8080/users/getusername/' + token[1], {
                                                headers: {
                                                    Authorization: localStorage.getItem("token")
                                                }
                                            })
                                                .then(response => response.text())
                                                .then(async function (text) {
                                                    localStorage.setItem("username", text)
                                                    await fetch('http://localhost:8080/orders/get-current/' + localStorage.getItem('userID'), {
                                                        headers: {
                                                            Authorization: localStorage.getItem("token")
                                                        }
                                                    }).then(response => response.text()).then(async function (text) {
                                                        await localStorage.setItem('orderID', text)
                                                    }).then(async function (text) {
                                                        await fetch('http://localhost:8080/orders/clear?id=' + text,
                                                            {
                                                                method: 'POST',
                                                                headers: {
                                                                    Authorization: localStorage.getItem('token')
                                                                }
                                                            }).then(r => {
                                                        })
                                                    });
                                                })
                                        })
                                        .then(function () {
                                            window.location.assign('http://localhost:3000/')
                                        })
                                        .catch(function () {
                                            toast({
                                                position: 'bottom-left',
                                                title: 'We have a problems.',
                                                description: 'Login or password was incorrect =(',
                                                status: 'error',
                                                colorScheme: 'blue',
                                                duration: 1000,
                                                isClosable: true,
                                            })
                                        })
                                }, 1000)
                            }}
                    >
                        {(props) => (
                            <Form>
                                <Field name='login'>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.login && form.touched.login}>
                                            <FormLabel>Login</FormLabel>
                                            <Input {...field} placeholder='login' type='text'/>
                                            <FormErrorMessage>{form.errors.login}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='password'>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.password && form.touched.password}>
                                            <FormLabel>Password</FormLabel>
                                            <Input {...field} placeholder='password' type='password'/>
                                            <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Center>
                                    <Button
                                        mt={4}
                                        type='back'
                                        marginRight={12}
                                        onClick={() => {
                                            window.location.assign('http://localhost:3000/welcome');
                                        }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        mt={4}
                                        colorScheme='blue'
                                        isLoading={props.isSubmitting}
                                        type='login'
                                    >
                                        Login
                                    </Button>
                                </Center>
                            </Form>
                        )}
                    </Formik></Box>
            </div>
        </ChakraProvider>
    );
}

export default Login;