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
    Link,
    useDisclosure,
    ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Modal
} from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import bcrypt from "bcryptjs";

const validationSchema = yup.object().shape({
    firstname: yup.string().required('Firstname is required!'),
    lastname: yup.string().required('Lastname is required!'),
    email: yup.string().required('E-mail is required!'),
});

function Profile(){
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [rePassword, setRePassword] = useState('')

    const handleOldPasswordChange = (e) => setOldPassword(e.target.value)
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value)
    const handleRePasswordChange = (e) => setRePassword(e.target.value)
    function changePassword(){
        if (newPassword === rePassword){
            if (newPassword !== oldPassword){
                const checkPassword = new Map();
                checkPassword.set('id', localStorage.getItem('userID'))
                fetch('http://localhost:8080/users/checkpassword?id=' + checkPassword.get('id'), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json;charset=utf-8',
                            Authorization: localStorage.getItem("token")},
                }).then(response => response.text()).then(function (text) {
                   if (bcrypt.compareSync(oldPassword,text)){
                                profile['password'] = newPassword;
                                fetch('http://localhost:8080/users/change/password', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json;charset=utf-8',
                                        Authorization: localStorage.getItem("token")},
                                    body: JSON.stringify(profile)
                                }).then(function () {
                                    toast({title: 'Password has been changed', status: "success", isClosable: true,})
                                    onClose();
                                })
                            } else {
                                toast({title: 'Old password is wrong!', status: "error", isClosable: true})
                            }
                        })
            } else toast({title: 'The new password must be different from the old one!', status: "error", isClosable: true})
        } else toast({title: 'Re-type password does not match new password!', status: "error", isClosable: true})
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [profile, setProfile] = useState([])
    useEffect(()=>{
    fetch('http://localhost:8080/users/'+localStorage.getItem('userID'), {headers: {
            Authorization: localStorage.getItem("token")}})
        .then(response => response.json())
        .then(setProfile)},[]);
    const toast = useToast()
    return (
        <ChakraProvider>
            <VStack marginTop={50}>
        <Center><Heading size={"lg"}>It's your profile!</Heading></Center>
            <div>
                <Formik initialValues={{ firstname: profile['firstname'], lastname: profile['lastname'], birthDay: profile['birthDay'], email: profile['email']}} validationSchema={validationSchema} enableReinitialize={true}
                        onSubmit={(values, actions) => {
                            setTimeout(() => {
                            actions.setSubmitting(false);
                            profile['firstname'] = values.firstname;
                            profile['lastname'] = values.lastname;
                            profile['birthDay'] = values.birthDay;
                            profile['email'] = values.email;
                            fetch('http://localhost:8080/users/change', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json;charset=utf-8',
                                        Authorization: localStorage.getItem("token")},
                                body: JSON.stringify(profile)
                            }).then(function () {toast({title: 'Changes saved', status: "success", isClosable: true,})})
                },1000)}}>
                    {(props) => (
                        <Form>
                            <Field name='firstname'>
                                {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.firstname && form.touched.firstname}>
                                        <FormLabel>Firstname</FormLabel>
                                        <Input {...field} placeholder='Firstname' type='text'/>
                                        <FormErrorMessage>{form.errors.firstname}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='lastname'>
                                {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.lastname && form.touched.lastname}>
                                        <FormLabel>Lastname</FormLabel>
                                        <Input {...field} placeholder='Lastname' type='text'/>
                                        <FormErrorMessage>{form.errors.lastname}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='birthDay'>
                                {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.birthDay && form.touched.birthDay}>
                                        <FormLabel>Birthday</FormLabel>
                                        <Input {...field} placeholder='Birthday' type='date'/>
                                        <FormErrorMessage>{form.errors.birthDay}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name='email' marginBottom={10}>
                                {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                                        <FormLabel>E-mail</FormLabel>
                                        <Input {...field} placeholder='E-mail' type='email'/>
                                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Center>
                                <VStack>
                                    <Link color={'blue'} marginTop={5} onClick={() => {onOpen()}}>Change password</Link>
                                <Button
                                    mt={4}
                                    colorScheme='blue'
                                    isLoading={props.isSubmitting}
                                    type='save'
                                >
                                    Save
                                </Button>
                                </VStack>
                            </Center>
                        </Form>
                    )}
                </Formik>
            </div>
            </VStack>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Changing password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                       <FormControl>
                           <FormLabel>Old password</FormLabel>
                           <Input type='password' value={oldPassword} onChange={handleOldPasswordChange} />
                       </FormControl>
                        <FormControl>
                            <FormLabel>New password</FormLabel>
                            <Input type='password' value={newPassword} onChange={handleNewPasswordChange} />
                        </FormControl>
                        <FormControl >
                            <FormLabel>Re-type password</FormLabel>
                            <Input type='password' value={rePassword} onChange={handleRePasswordChange} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={"blue"} onClick={changePassword}>Change password</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ChakraProvider>
    );
}

export default Profile;