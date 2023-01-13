/** @format */

import { gql, useQuery } from "@apollo/client";
import { Box, Flex, List, ListItem } from "@chakra-ui/react";
import React from "react";

/** @format */
function RaceDayList() {
  const { loading, error, data } = useQuery(GET_RACEDAYS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error </p>;
  const arrayOfRacedays = data.racaDays.data;
  console.log(arrayOfRacedays);
  return (
    <>
      <h2>RaceDays</h2>
      <Flex flexDir="column">
        {arrayOfRacedays.map((raceday: any) => (
          <Flex
            minW={"30em"}
            minH={"10em"}
            bgColor={"red"}
            flexDir={"row"}
            justifyContent={"space-between"}
            m={"2em"}
            flex={1}
            key={raceday.attributes.RaceDate}
          >
            <Box>{raceday.attributes.RaceDate}</Box>
            <Box>{raceday.attributes.EventDescription} </Box>
            <Box>{raceday.attributes.RaceDayCapacity}</Box>
          </Flex>
        ))}
      </Flex>
    </>
  );
}

export default RaceDayList;
const GET_RACEDAYS = gql`
  {
    racaDays {
      data {
        attributes {
          publishedAt
          RaceDate
          EventDescription
          RaceDayCapacity
        }
      }
    }
  }
`;
