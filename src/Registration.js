import React, {useEffect, useState} from "react";
import {
    Button,
    Heading,
    VStack,
    Center,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react'
import {ChakraProvider} from '@chakra-ui/react'
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import InputMask from "react-input-mask";

const validationSchema = yup.object().shape({
    firstname: yup.string().required('Firstname is required!'),
    lastname: yup.string().required('Lastname is required!'),
    email: yup.string().required('E-mail is required!'),
    birthDay: yup.string().required('Birthday is required!'),
    phoneNumber: yup.string().required('Phone number is required!'),
    login: yup.string().required('Login is required!'),
    password: yup.string().required('Password is required!'),
    retype: yup.string().required('Retype password is required!'),
});

function Registration() {
    const [profile, setProfile] = useState({})
    useEffect(() => {
        fetch('http://localhost:8080/users/' + localStorage.getItem('userID'), {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(setProfile)
    }, []);
    const toast = useToast()
    return (
        <ChakraProvider>
            <VStack marginTop={50}>
                <Center><Heading size={"lg"}>Let's acquainted!</Heading></Center>
                <div>
                    <Formik initialValues={{firstname: '', lastname: '', birthDay: '', email: ''}}
                            validationSchema={validationSchema} enableReinitialize={true}
                            onSubmit={(values, actions) => {
                                if (values.password == values.retype) {
                                    setTimeout(() => {
                                        actions.setSubmitting(false);
                                        profile['firstname'] = values.firstname;
                                        profile['lastname'] = values.lastname;
                                        profile['birthDay'] = values.birthDay;
                                        profile['email'] = values.email;
                                        profile['password'] = values.password;
                                        profile['login'] = values.login;
                                        profile['phoneNumber'] = values.phoneNumber;
                                        fetch('http://localhost:8080/register', {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json;charset=utf-8'},
                                            body: JSON.stringify(profile)
                                        }).then(function () {
                                            toast({title: 'Changes saved', status: "success", isClosable: true,})
                                        })
                                            .then(async function () {
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
                                                        fetch('http://localhost:8080/orders/get-current/' + localStorage.getItem('userID'), {
                                                            headers: {
                                                                Authorization: localStorage.getItem("token")
                                                            }
                                                        }).then(response => response.text()).then(function (text) {
                                                            localStorage.setItem('orderID', text)
                                                        });
                                                        return [json['token'], json['userID'], json['role']]
                                                    })
                                                    .then(await async function (token) {
                                                        localStorage.setItem('token', "Bearer_" + token[0]);
                                                        localStorage.setItem('userID', token[1]);
                                                        localStorage.setItem('role', '' + token[2])
                                                        await fetch('http://localhost:8080/users/getusername/' + token[1], {
                                                            headers: {
                                                                Authorization: localStorage.getItem("token")
                                                            }
                                                        })
                                                            .then(response => response.text())
                                                            .then(function (text) {
                                                                localStorage.setItem("username", text)
                                                            })
                                                    })
                                                    .then(function () {
                                                        window.location.assign('http://localhost:3000/')
                                                    })
                                            })
                                    }, 1000)
                                } else {
                                    toast({
                                        title: 'Password and "Retype password" doesnt match',
                                        status: "error",
                                        isClosable: true,
                                    })
                                    actions.setSubmitting(false)
                                }
                            }}>
                        {(props) => (
                            <Form>
                                <Field name='firstname'>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.firstname && form.touched.firstname}>
                                            <FormLabel>Firstname</FormLabel>
                                            <Input {...field} placeholder='Firstname' type='text'/>
                                            <FormErrorMessage>{form.errors.firstname}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='lastname'>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.lastname && form.touched.lastname}>
                                            <FormLabel>Lastname</FormLabel>
                                            <Input {...field} placeholder='Lastname' type='text'/>
                                            <FormErrorMessage>{form.errors.lastname}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='birthDay'>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.birthDay && form.touched.birthDay}>
                                            <FormLabel>Birthday</FormLabel>
                                            <Input {...field} placeholder='Birthday' type='date'/>
                                            <FormErrorMessage>{form.errors.birthDay}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='email' marginBottom={10}>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                                            <FormLabel>E-mail</FormLabel>
                                            <Input {...field} placeholder='E-mail' type='email'/>
                                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='phoneNumber' marginBottom={10}>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.phoneNumber && form.touched.phoneNumber}>
                                            <FormLabel>Phone number</FormLabel>
                                            <Input as={InputMask}  {...field} mask="999 999 99 99" maskChar={null}
                                                   placeholder='Phone number'/>
                                            <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='login' marginBottom={10}>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.login && form.touched.login}>
                                            <FormLabel>Login</FormLabel>
                                            <Input {...field} placeholder='Login' type='text'/>
                                            <FormErrorMessage>{form.errors.login}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='password' marginBottom={10}>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.password && form.touched.password}>
                                            <FormLabel>Password</FormLabel>
                                            <Input {...field} placeholder='Password' type='password'/>
                                            <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='retype' marginBottom={10}>
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.retype && form.touched.retype}>
                                            <FormLabel>Retype password</FormLabel>
                                            <Input {...field} placeholder='Retype password' type='password'/>
                                            <FormErrorMessage>{form.errors.retype}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Center>

                                    <Button
                                        mt={4}
                                        type='button'
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
                                        type='submit'
                                    >
                                        Create user
                                    </Button>

                                </Center>
                            </Form>
                        )}
                    </Formik>
                </div>
            </VStack>
        </ChakraProvider>
    );
}

export default Registration;