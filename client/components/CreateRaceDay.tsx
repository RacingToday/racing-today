/** @format */
import { getMyUser } from "../lib/helperFunctions";

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
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverTrigger,
  PopoverFooter,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import React, { useState } from "react";
import Link from "next/link";

function CreateRaceDay() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [EventDescription, setEventDescription] = useState("");
  const [Price, setPrice] = useState("");
  const [Track, setTrack] = useState("Please Select a Track");
  const [Date, setDate] = useState("");
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [Capacity, setCapacity] = useState("");
  const [trackID, setTrackID] = useState(0);

  const { loading, error, data } = useQuery(GET_RACETRACKS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p> Error </p>;
  const arrayOfRaceTracks = data.raceTracks.data;
  interface RaceTrack {
    id: number;
    attributes: {
      TrackName: string;
    };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startTimeToSend = StartTime + ":00:000";
    const EndTimeToSend = EndTime + ":00:000";
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      return;
    }
    const userAndJWT = await getMyUser(jwt);

    const newRaceDay = await fetch("http://localhost:1337/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {
          createRacaDay(data: {
              EventDescription: "${EventDescription}",
              Price: ${Price},
              RaceDate: "${Date}",
              race_track: ${trackID},
              StartTime: "${startTimeToSend}",
              EndTime: "${EndTimeToSend}",
              OrganizerEmail: "${userAndJWT.username}"
              Capacity: ${Capacity}
          }) {
            data {
              id
              attributes {
              EventDescription
              Price
              RaceDate
              }
            }
          }
        }`,
      }),
    }).then((res) => res.json());
    setEventDescription("");
    setPrice("");
    setTrack("please select a track");
    setDate("");
    setStartTime("");
    setEndTime("");
    setCapacity("");
    setTrackID(0);
    console.log(newRaceDay);
  };
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
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Event Description</FormLabel>
                <Textarea
                  variant={"filled"}
                  placeholder="Please add a description of the event"
                  onChange={(e) => setEventDescription(e.target.value)}
                  value={EventDescription}
                />
                <FormLabel>Event Date</FormLabel>
                <Input
                  value={Date}
                  variant={"filled"}
                  type={"date"}
                  onChange={(e) => setDate(e.target.value)}
                />
                <FormLabel>Start Time</FormLabel>
                <Input
                  onChange={(e) => setStartTime(e.target.value)}
                  value={StartTime}
                  variant={"filled"}
                  type={"time"}
                />
                <FormLabel>End Time</FormLabel>
                <Input
                  value={EndTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  variant={"filled"}
                  type={"time"}
                />
                <FormLabel>Price</FormLabel>
                <Input
                  w={"auto%"}
                  variant={"filled"}
                  onChange={(e) => setPrice(e.target.value)}
                  type={"number"}
                  value={Price}
                />
                <FormLabel>Track</FormLabel>
                <Menu>
                  <MenuButton as={Button}>{Track}</MenuButton>
                  <MenuList>
                    {arrayOfRaceTracks.map(
                      (raceTrack: RaceTrack, index: number) => (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            setTrack(raceTrack.attributes.TrackName);
                            setTrackID(raceTrack.id);
                          }}
                        >
                          {raceTrack.attributes.TrackName}
                        </MenuItem>
                      )
                    )}
                  </MenuList>
                  <FormLabel>Raceday capacity</FormLabel>
                  <Input
                    value={Capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    w={"auto%"}
                    placeholder="example: 20"
                    type={"number"}
                  />
                </Menu>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      type="submit"
                      onClick={(e) => handleSubmit}
                      colorScheme={"blue"}
                    >
                      Submit
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader
                      borderTopRadius={"8px"}
                      bgColor={"green.400"}
                      w={"500px"}
                    >
                      Success!
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton w={"auto"} />
                    <PopoverBody
                      bgColor={"green.200"}
                      w={"500px"}
                      borderBottomRadius={"8px"}
                    >
                      Your Raceday has been created! You can create more by
                      filling out the form again.
                    </PopoverBody>
                    <PopoverFooter w={"500px"} bgColor={"green.200"}>
                      <Button onClick={onClose}>Close this form</Button>
                      <Button m={"0.4em 1em"} colorScheme={"blue"}>
                        <Link href={"/racedays"}>Go to my Racedays</Link>
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>

                <Button onClick={onClose}>Close</Button>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateRaceDay;

const GET_RACETRACKS = gql`
  {
    raceTracks {
      data {
        id
        attributes {
          TrackName
        }
      }
    }
  }
`;

const CREATE_RACEDAY = gql`
  mutation {
    createRacaDay(
      data: {
        EventDescription: "RaceDayCapacity"
        Messages: "test"
        RaceDate: "2022-06-20"
        StartTime: "10:00:00:000"
        EndTime: "22:00:00:000"
        Price: 500
        race_track: "2"
        OrganizerEmail: "test123"
      }
    ) {
      data {
        id
        attributes {
          EventDescription
          Messages
          RaceDate
          StartTime
          EndTime
          Price
          OrganizerEmail
          race_track {
            data {
              id
              attributes {
                TrackName
              }
            }
          }
        }
      }
    }
  }
`;
