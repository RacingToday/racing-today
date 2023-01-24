/** @format */

import { Box, Button, Flex, Input } from "@chakra-ui/react";
import React from "react";
import { getMyUser } from "../lib/helperFunctions";
import { useState } from "react";
import { type } from "os";
import { useQuery } from "@apollo/client";

function Messages() {
  const [ListOfRaceDays, setListOfRaceDays] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [arrayOfMessages, setArrayOfMessages] = useState<any[]>([]);
  const [myEmail, setMyEmail] = useState("");
  const [messageIndex, setMessageIndex] = useState<number>(0);

  const sendNewMessage = async (
    messageIndex: number,
    currentMessage: string,
    myEmail: string
  ) => {
    interface newMessage {
      data: {
        createMessage: {
          data: {
            id: number;
            attributes: {
              Text: string;
              Sender: string;
            };
          };
        };
      };
    }
    const newMessage: newMessage = await fetch(
      "http://localhost:1337/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          query: `mutation {
          createMessage(data: {
            Text: "${currentMessage}",
            Sender: "${myEmail}",
            race_day: ${messageIndex}
          }) {
            data {
              id
              attributes {
                Text
                Sender
              }
            }
          }
        }`,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => data);
    console.log(newMessage);
    setArrayOfMessages([
      ...arrayOfMessages,
      newMessage.data.createMessage.data,
    ]);
    setCurrentMessage("");
  };

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

        const myMessages: any = await fetch("http://localhost:1337/graphql", {
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
        }).then((res) => res.json());
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
          ListOfRaceDays.map((message: any) => {
            return (
              <Button
                mt={1}
                size={"lg"}
                p={1}
                flex={1}
                border={"none"}
                onClick={() => {
                  setArrayOfMessages(message.attributes.messages.data);
                  setMessageIndex(message.id);
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
        border="none"
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
          flex={1}
          flexDir={"column"}
          borderBottom="1px dotted black"
        >
          {arrayOfMessages.length > 0 ? (
            arrayOfMessages.map((message: any, index) => {
              return (
                <Box
                  key={index}
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
          mt={5}
          placeholder="Type your message here"
          type={"text"}
          id={"message"}
          size={"lg"}
          w={"90%"}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentMessage.length > 0) {
              sendNewMessage(messageIndex, currentMessage, myEmail);
            }
          }}
        />
      </Flex>
    </Flex>
  );
}

export default Messages;
