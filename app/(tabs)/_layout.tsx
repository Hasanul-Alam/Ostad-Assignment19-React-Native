import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="chat"
        options={{ headerShown: false, title: "Chat" }}
      />
      <Tabs.Screen
        name="recentChats"
        options={{ headerShown: false, title: "Recent Chats" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
