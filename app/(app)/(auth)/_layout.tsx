import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs  screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarStyle: {display:"none"},
          }}>
      <Tabs.Screen name='index' options={{  headerShown: false }}/>
      <Tabs.Screen name='authType' options={{  headerShown: false }}/>
      <Tabs.Screen name='login' options={{  headerShown: false }}/>
      <Tabs.Screen name='registration' options={{  headerShown: false }}/>
      <Tabs.Screen name='accountSetup' options={{headerShown: false}}/>
    </Tabs>
  );
}
