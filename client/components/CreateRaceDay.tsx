/** @format */

import {
  Flex,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import React, { useState } from "react";

function CreateRaceDay() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [EventDescription, setEventDescription] = useState("");
  const [Price, setPrice] = useState("");

  return (
    <>
      <Button size={"sm"} colorScheme="blue" onClick={onOpen}>
        Create Raceday
      </Button>
      <Modal size={"5xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Raceday</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Event Description</FormLabel>
              <Textarea
                variant={"filled"}
                placeholder="Please add a description of the event"
                onChange={(e) => setEventDescription(e.target.value)}
              >
                {EventDescription}
              </Textarea>
              <FormLabel>Event Date</FormLabel>
              <Input variant={"filled"} type={"date"} />
              <FormLabel>Start Time</FormLabel>
              <Input variant={"filled"} type={"time"} />
              <FormLabel>End Time</FormLabel>
              <Input variant={"filled"} type={"time"} />
              <FormLabel>Price</FormLabel>
              €
              <Input
                w={"auto%"}
                variant={"filled"}
                onChange={(e) => setPrice(e.target.value)}
                value={Price}
              />
              <FormLabel>Track</FormLabel>
              <Menu>
                <MenuButton as={Button}>Select The Track You Rented</MenuButton>
                <MenuList>
                  <MenuItem>Download</MenuItem>
                  <MenuItem>Create a Copy</MenuItem>
                  <MenuItem>Mark as Draft</MenuItem>
                  <MenuItem>Delete</MenuItem>
                  <MenuItem>Attend a Workshop</MenuItem>
                </MenuList>
              </Menu>
              <FormLabel>Raceday capacity</FormLabel>
              <Input w={"auto%"} placeholder="example: 20" type={"number"} />
            </FormControl>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateRaceDay;
