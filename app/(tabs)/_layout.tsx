import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

/**
 * Tab navigation layout component for the main authenticated app
 * Provides bottom tab navigation between Home and Tasks screens
 * @returns JSX.Element - The tab navigation layout
 */
export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
