import { Layout } from "@/components/layout/layout";
import { Colors } from "@/constants/Colors";
import AppProvider from "@/context/appcontext";
import { useAuth } from "@/context/authcontext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoaded } = useAuth();

  if (!isLoaded) return;

  return (
    <AppProvider>
      <Layout>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: false,
            tabBarStyle: {
              display: "none",
            },
          }}
        />
      </Layout>
    </AppProvider>
  );
}
