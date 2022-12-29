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
import md5 from "md5";
const logo = 'logo.png';
const validationSchema = yup.object().shape({
    login: yup.string().required('Login is required!'),
    password: yup.string().required('Password is required!'),
});



function Login(props){
    const toast = useToast();
    return (
        <ChakraProvider>
            <Center>
                <Box boxSize='20%' >
                    <Image
                        w='70%'
                        margin='auto'
                        src={logo}
                        alt='SCE Cafe'
                    />
                <Formik initialValues={{ login: '', password: ''}} validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        setTimeout(() => {
                            actions.setSubmitting(false)
                            fetch('http://localhost:8080/users/'+values.login + '/' + md5(values.password))
                                .then(response => response.text())
                                .then(function (text){
                                    if (Number(text) !== 0) {
                                        localStorage.setItem('isLoggedIn', 'true');
                                        localStorage.setItem('userID', text)
                                        props.setIsLoggedIn(true)
                                        fetch('http://localhost:8080/users/getrole?id='+localStorage.getItem('userID'))
                                            .then(response => response.text()).then(function (text){localStorage.setItem('role', text)})
                                    } else toast({title: 'Incorrect username or password', status: "warning", isClosable: true,})});
                        }, 1000)
                    }}
                >
                    {(props) => (
                        <Form>
                            <Field name='login'>
                                {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.login && form.touched.login}>
                                        <FormLabel>Login</FormLabel>
                                        <Input {...field} placeholder='login' type='text'/>
                                        <FormErrorMessage>{form.errors.login}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='password'>
                                {({ field, form }) => (
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
            </Center>
        </ChakraProvider>
    );
}

export default Login;