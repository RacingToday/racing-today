/** @format */

import { Box, Button, Flex, Input } from "@chakra-ui/react";
import React from "react";
import { getMyUser } from "../lib/helperFunctions";
import { useState } from "react";
import { type } from "os";

function Messages() {
  const [ListOfRaceDays, setListOfRaceDays] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [arrayOfMessages, setArrayOfMessages] = useState([]);
  const [myEmail, setMyEmail] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  const GetMyMessages = async () => {
    if (localStorage.getItem("jwt") !== null) {
      const jwt = localStorage.getItem("jwt");
      if (typeof jwt === "string" && jwt.length > 0) {
        interface user {
          id: number;
          username: string;
        }

        const user = await getMyUser(jwt);
        setMyEmail(user.username);
        console.log(user);
        const myMessages: message = await fetch(
          "http://localhost:1337/graphql",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              query: `{
                usersPermissionsUser(id: ${user.id}) {
      data {
        id
        attributes {
          email
          race_days {
            data {
              id
              attributes {
                RaceDate
                race_track {
                  data {
                    attributes {
                      TrackName
                    }
                  }
                }
                messages {
                  data {
                    attributes {
                      Text
                      Sender
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
          }
        ).then((res) => res.json());
        setListOfRaceDays(
          myMessages.data.usersPermissionsUser.data.attributes.race_days.data
        );
        console.log(
          myMessages.data.usersPermissionsUser.data.attributes.race_days.data
        );
      }
    }
    return;
  };

  React.useEffect(() => {
    GetMyMessages();
  }, []);

  interface messages {
    id: number;
    attributes: {
      RaceDate: string;
      race_track: {
        data: {
          attributes: {
            TrackName: string;
          };
        };
      };
      messages: {
        data: {
          attributes: {
            Text: string;
            Sender: string;
          };
        }[];
      };
    };
  }

  return (
    <Flex
      overflow={"hidden"}
      flexDir="row"
      bgColor={"gray.100"}
      flexWrap={"wrap"}
    >
      <Flex
        p={4}
        className="chatSelection"
        overflow={"hidden"}
        flexDir={"column"}
      >
        <h1
          style={{
            fontSize: "1.5em",
          }}
        >
          Messages
        </h1>

        {ListOfRaceDays.length > 0 ? (
          ListOfRaceDays.map((message: messages) => {
            return (
              <Button
                mt={1}
                size={"lg"}
                p={1}
                flex={1}
                border={"none"}
                onClick={() => {
                  setArrayOfMessages(message.attributes.messages.data);
                  console.log(arrayOfMessages);
                }}
                w={"15em"}
                colorScheme={"blue"}
                display={"flex"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
                fontSize={"1em"}
                overflow={"hidden"}
                fontWeight={"bold"}
                flexDir={"column"}
                maxH={"4em"}
                m={"0.5em"}
                key={message.id}
              >
                Date: {message.attributes.RaceDate}
                <br />
                Track: {message.attributes.race_track.data.attributes.TrackName}
              </Button>
            );
          })
        ) : (
          <h1>No messages</h1>
        )}
      </Flex>
      <Flex
        padding={3}
        minH={"78vh"}
        minW={"75vw"}
        maxH={"78vh"}
        overflow={"hidden"}
        className="chat"
        border="1px solid black"
        borderRadius={"15px"}
        bgColor={"white"}
        flexDir={"column"}
        alignItems="flex-start"
        justifyContent={"space-between"}
      >
        <Flex
          w={"100%"}
          className="chatMessages"
          overflow={"auto"}
          flexDir={"column"}
        >
          {arrayOfMessages.length > 0 ? (
            arrayOfMessages.map((message) => {
              return (
                <Box
                  key={message.id}
                  mt={3}
                  bgColor={"blue.400"}
                  borderRadius={"15px"}
                  p={3}
                  w={"fit-content"}
                  backgroundColor={
                    message.attributes.Sender === myEmail
                      ? "green.400"
                      : "blue.400"
                  }
                  alignContent={"flex-start"}
                  alignSelf={
                    message.attributes.Sender === myEmail
                      ? "flex-end"
                      : "flex-start"
                  }
                >
                  <p
                    style={{
                      fontSize: "0.7em",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {message.attributes.Sender}
                  </p>

                  <p
                    style={{
                      fontSize: "1.3em",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {message.attributes.Text}
                  </p>
                </Box>
              );
            })
          ) : (
            <h1>No messages</h1>
          )}
        </Flex>
        <Input
          mt={4}
          placeholder="Type your message here"
          type={"text"}
          id={"message"}
          w={"90%"}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentMessage.length > 0) {
              console.log(currentMessage);
            }
          }}
        />
      </Flex>
    </Flex>
  );
}

export default Messages;

// attributes, messages, attributes, text, sender
