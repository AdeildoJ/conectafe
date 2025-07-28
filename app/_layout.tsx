import { Slot, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Playwrite: require('../assets/fonts/Playwrite_AU_NSW.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoggedIn === null) return;

    const inTabs = segments[0] === '(tabs)';

    if (!isLoggedIn && inTabs) {
      router.replace('/');
    } else if (isLoggedIn && !inTabs) {
      router.replace('/(tabs)/home');
    }
  }, [isLoggedIn, segments]);

  if (!fontsLoaded || isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#663399" />
      </View>
    );
  }

  return <Slot />;
}
