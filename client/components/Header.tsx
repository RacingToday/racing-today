/** @format */

import {
  Button,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  FormControl,
  Input,
  ModalFooter,
  Tabs,
  TabList,
  TabPanels,
  Text,
  TabPanel,
  Icon,
  Tab,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import { MyRaceDay } from "../lib/types";
import { createNewUser, getMyUser, loginUser } from "../lib/helperFunctions";
import React, { useState } from "react";
import CreateRaceDay from "./CreateRaceDay";
import Link from "next/link";
import AuthHeader from "./AuthHeader";

function Header(props: any) {
  const { isOpen: isOpen, onOpen, onClose } = useDisclosure();

  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [registerEmail, setRegisterEmail] = React.useState("");
  const [registerPassword, setRegisterPassword] = React.useState("");
  const [validEmailError, setValidEmailError] = React.useState(false);
  const [validPasswordError, setValidPasswordError] = React.useState(false);
  const [validAccountCreation, setValidAccountCreation] = React.useState(false);
  const [validLogin, setValidLogin] = React.useState(false);
  const [userId, setUserId] = React.useState(0);

  const [loginOrShowUserData, setLoginOrShowUserData] = React.useState(
    <Flex gap="5">
      <Link href="/">
        <Button colorScheme="blue" size="sm">
          Home
        </Button>
      </Link>
      <Button colorScheme="blue" size={"sm"} onClick={onOpen}>
        Login or Register
      </Button>
      <Link href="about">
        <Button colorScheme="blue" size="sm">
          About Us
        </Button>
      </Link>
      <Link href="terms">
        <Button colorScheme="blue" size="sm">
          Terms And Conditions
        </Button>
      </Link>
    </Flex>
  );

  React.useEffect(() => {
    const checkForUser = async () => {
      if (localStorage.getItem("jwt") !== null) {
        const jwt = localStorage.getItem("jwt");
        if (typeof jwt === "string" && jwt.length > 0) {
          const user = await getMyUser(jwt);
          if (user.error) {
            localStorage.removeItem("jwt");
            if (window.location.pathname === "/myracedays") {
              window.location.href = "/";
            }
            return;
          }

          setUserId(user.id);

          setLoginOrShowUserData(<AuthHeader props={props} />);
        }
      }
      return;
    };

    checkForUser();
  }, []);

  const handleLogin = async () => {
    const login = await loginUser(loginEmail, loginPassword);
    const { jwt }: any = login;

    if (typeof jwt === "string" && jwt.length > 0) {
      localStorage.setItem("jwt", jwt);
      const user = await getMyUser(jwt);
      setValidLogin(true);
      onClose();
      setLoginOrShowUserData(<AuthHeader props={props} />);
      return;
    }
    return;
  };

  const handleAccountCreation = async () => {
    if (!registerEmail.includes("@") || !registerEmail.includes(".")) {
      setValidEmailError(true);
    }
    if (registerPassword.length < 8) {
      setValidPasswordError(true);
    } else {
      const newUser = await createNewUser(registerEmail, registerPassword);
      const { jwt }: any = newUser;

      localStorage.setItem("jwt", jwt);

      setValidAccountCreation(true);
      setLoginOrShowUserData(<AuthHeader props={props} />);

      onClose();
    }

    return;
  };

  return (
    <Flex
      pt={"1em"}
      pr={"1em"}
      flex={1}
      h={"5rem"}
      justifyContent={"space-between"}
      flexDir="row-reverse"
      color={"#fff"}
      minW={"100%"}
      maxW={"100%"}
      bg={"#000"}
    >
      {validAccountCreation && (
        <Alert
          mb={2}
          zIndex={100}
          variant="solid"
          pos={"absolute"}
          status="success"
          top={"5rem"}
        >
          <AlertIcon />
          <AlertDescription>
            Welcome to RacingToday - you have now created your account and can
            start browsing tracks
          </AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setValidAccountCreation(false)}
          />
        </Alert>
      )}
      {loginOrShowUserData}
      <Link href="/">
        <Box className="SiteName" m={"0em 2em"}>
          <Text fontSize={"2xl"}>RacingToday</Text>
        </Box>
      </Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Tabs>
            <TabList>
              <Tab>Login</Tab>
              <Tab>Create Account</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ModalHeader>
                  <Text> Enter your login details to sign in</Text>
                </ModalHeader>
                <ModalBody>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type={"email"}
                      value={loginEmail}
                      placeholder="Enter your email here"
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type={"password"}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      value={loginPassword}
                      placeholder="password"
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={handleLogin}
                    type="submit"
                    colorScheme="blue"
                    mr={3}
                  >
                    Login
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </TabPanel>
              <TabPanel>
                <ModalHeader>
                  {validEmailError && (
                    <Alert mb={2} status="info">
                      <AlertIcon />
                      <AlertDescription>
                        Please enter a valid email address
                      </AlertDescription>
                      <CloseButton
                        position="absolute"
                        right="8px"
                        top="8px"
                        onClick={() => setValidEmailError(false)}
                      />
                    </Alert>
                  )}
                  {validPasswordError && (
                    <Alert mb={2} status="info">
                      <AlertIcon />
                      <AlertDescription>
                        Please enter a valid password longer than 8 characters
                      </AlertDescription>
                      <CloseButton
                        position="absolute"
                        right="8px"
                        top="8px"
                        onClick={() => setValidPasswordError(false)}
                      />
                    </Alert>
                  )}
                  <Text> Enter your login details to sign in</Text>
                </ModalHeader>
                <ModalBody>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type={"email"}
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      name="lEmail"
                      placeholder="Enter your email here"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Account Password</FormLabel>
                    <Input
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      value={registerPassword}
                      placeholder="password"
                      type={"password"}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={handleAccountCreation}
                    colorScheme="blue"
                    mr={3}
                  >
                    Create Account
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Header;
