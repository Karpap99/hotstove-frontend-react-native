import 'react-native-reanimated';
import "@/lang/i18n"
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthProvider from '@/context/authcontext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    ComfortaaRegular: require('../assets/fonts/comfortaa/Comfortaa-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
        <Stack>
          <Stack.Screen name="(app)" options={{  headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
