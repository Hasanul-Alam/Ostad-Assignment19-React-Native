import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarIcon: (
            { color, size } // ← Use destructured props
          ) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recentChats"
        options={{
          headerShown: false,
          title: "Recent Chats",
          tabBarLabel: "Recent Chats",
        }}
      />

      <Tabs.Screen
        name="test"
        options={{
          headerShown: false,
          title: "Test",
          tabBarLabel: "Test",
          tabBarIcon: (
            { color, size } // ← Use destructured props
          ) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
