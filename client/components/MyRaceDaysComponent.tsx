/** @format */

import React, { useEffect, useState } from "react";
import { ChatIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { getMyUser } from "../lib/helperFunctions";

function MyRaceDayComponent() {
  const [MyRaceDays, setMyRaceDays] = useState([]);

  const GetUser = async () => {
    if (localStorage.getItem("jwt") !== null) {
      const jwt = localStorage.getItem("jwt");
      if (typeof jwt === "string" && jwt.length > 0) {
        const user = await getMyUser(jwt);
        const myDays = await fetch("http://localhost:1337/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            query: `{
    usersPermissionsUser(id: 20) {
      data {
        id
        attributes {
          email
          race_days {
            data {
              id
              attributes {
                RaceDate
                StartTime
                EndTime
                OrganizerEmail
                Capacity
                EventDescription
                race_track {
                  data {
                    attributes {
                      TrackName
                      Location
                      TrackDescription
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
            `,
          }),
        }).then((res) => res.json());
        setMyRaceDays(
          myDays.data.usersPermissionsUser.data.attributes.race_days.data
        );

        console.log(
          myDays.data.usersPermissionsUser.data.attributes.race_days.data
        );
      }
    }
    return;
  };

  useEffect(() => {
    GetUser();
  }, []);

  interface MyRaceDay {
    id: number;
    attributes: {
      RaceDate: string;
      StartTime: string;
      EndTime: string;
      EventDescription: string;
      OrganizerEmail: string;
      Capacity: number;
      race_track: {
        data: {
          attributes: {
            TrackName: string;
            TrackDescription: string;
            Location: string;
          };
        };
      };
    };
  }

  return (
    <>
      <Flex p={"2em 5em"} minW="100vw" minH={"100vh"}>
        <h1>My Track Days</h1>
        <Accordion minW="90%">
          {MyRaceDays.length > 0 &&
            MyRaceDays.map((raceDay: MyRaceDay) => (
              <AccordionItem border={"1px dotted black"} key={raceDay.id}>
                <AccordionButton>
                  <Flex gap="1em" flexDirection={"row"}>
                    <h3>
                      Track:{" "}
                      {raceDay.attributes.race_track.data.attributes.TrackName}
                    </h3>
                    <h2>Date: {raceDay.attributes.RaceDate}</h2>
                    <h3>
                      Start Time: {raceDay.attributes.StartTime.slice(0, 5)}
                    </h3>
                    <h3>End Time: {raceDay.attributes.EndTime.slice(0, 5)}</h3>
                    <h3>{}</h3>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel minH={"20em"} minW={"100%"}>
                  <Flex minW={"100%"}>
                    <Flex
                      flexDir={"column"}
                      borderRight="1px solid black"
                      minH={"25em"}
                      w={"30%"}
                    >
                      <h2>Track Info</h2>
                      <br />
                      image goes here
                      <br />
                      <Text>
                        {
                          raceDay.attributes.race_track.data.attributes
                            .TrackDescription
                        }
                      </Text>
                    </Flex>
                    <Flex p={"1em 2em"} flexDir={"column"}>
                      <Text pb={"1em"}>
                        <h2>Event Description</h2>
                        <br />
                        {raceDay.attributes.EventDescription}
                      </Text>
                      <Flex
                        borderTop={"1px solid black"}
                        pt={"1em"}
                        flexDir={"row"}
                      >
                        <List>
                          <ListItem>
                            Capacity: {raceDay.attributes.Capacity}
                          </ListItem>
                          <ListItem>
                            Organizer: {raceDay.attributes.OrganizerEmail}
                          </ListItem>
                          <ListItem>
                            Location:{" "}
                            {
                              raceDay.attributes.race_track.data.attributes
                                .Location
                            }
                          </ListItem>
                          <ListItem>
                            Start Time:{" "}
                            {raceDay.attributes.StartTime.slice(0, 5)}
                          </ListItem>
                          <ListItem>
                            End Time: {raceDay.attributes.EndTime.slice(0, 5)}
                          </ListItem>
                          <ListItem>
                            Date: {raceDay.attributes.RaceDate}
                          </ListItem>
                        </List>
                        <iframe
                          style={{
                            marginLeft: "10em",
                            borderRadius: "10px",
                          }}
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11966.87110823999!2d2.1310633420944307!3d41.42364469188054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a497f0b2911c6f%3A0x2c79835d843d7146!2sCamp%20de%20Futbol%20Sant%20Gen%C3%ADs!5e0!3m2!1sen!2ses!4v1674063222656!5m2!1sen!2ses"
                          width="350em"
                          height="350em"
                          loading="lazy"
                        ></iframe>
                      </Flex>
                    </Flex>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      </Flex>
    </>
  );
}

export default MyRaceDayComponent;