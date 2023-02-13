/** @format */
import { RaceDay } from "../lib/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Image,
  useDisclosure,
  List,
} from "@chakra-ui/react";

export default function RequestToJoin(raceday: any) {
  const { isOpen: isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} colorScheme={"blue"}>
        Request to Join
      </Button>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {raceday.raceDay.attributes.RaceDate}
            {" - "}
            {raceday.raceDay.attributes.race_track.data.attributes.TrackName}
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody mb={4}>
            <Image
              src={
                "https://images.unsplash.com/photo-1536909526839-8f10e29ba80c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
              }
              alt="picture of drift car"
              borderRadius={"lg"}
              height={"400px"}
              width={"100%"}
            />
            <List mt={4} gap={4}>
              <li>
                <strong>Event Description:</strong>{" "}
                {raceday.raceDay.attributes.EventDescription}
              </li>
              <li>
                <strong>Start Time:</strong>{" "}
                {raceday.raceDay.attributes.StartTime}
              </li>
              <li>
                <strong>End Time:</strong> {raceday.raceDay.attributes.EndTime}
              </li>
              <li>
                <strong>Capacity:</strong> {raceday.raceDay.attributes.Capacity}
              </li>
              <li>
                <strong>Price:</strong> {raceday.raceDay.attributes.Price}
              </li>
            </List>
            <Button mt={4} colorScheme={"blue"}>
              Confirm Request
            </Button>
            <Button mt={4} ml={4} onClick={onClose} colorScheme={"red"}>
              Cancel
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
