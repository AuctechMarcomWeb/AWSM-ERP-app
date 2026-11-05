import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../Screens/UnauthScreen/SplashScreen/SplashScreen';
import LoginScreen from '../Screens/UnauthScreen/LoginScreen/LoginScreen';

const Stack = createNativeStackNavigator();

const UnauthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ animationEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default UnauthNavigation;
