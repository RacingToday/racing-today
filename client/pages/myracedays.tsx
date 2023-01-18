/** @format */

import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import Header from "../components/Header";
import { getMyUser } from "../lib/helperFunctions";
import MyRaceDayComponent from "../components/MyRaceDaysComponent";
import Messages from "../components/Messages";

function MyRaceDays() {
  React.useEffect(() => {
    const userCheck = async () => {
      if (localStorage.getItem("jwt") !== null) {
        const jwt = localStorage.getItem("jwt");
        if (typeof jwt === "string" && jwt.length > 0) {
          const user = await getMyUser(jwt);
          localStorage.setItem("user", JSON.stringify(user));
        }
      }
      return;
    };
    userCheck();
  }, []);

  return (
    <>
      <Header />
      <Tabs>
        <TabList>
          <Tab>My RaceDays</Tab>
          <Tab>Messages</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <MyRaceDayComponent />
          </TabPanel>
          <TabPanel>
            <Messages />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default MyRaceDays;