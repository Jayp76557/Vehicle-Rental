import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import AddCar from './screens/AddCar';
import Logout from './screens/Logout';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Booking from './screens/booking';

// Obtain instance of navigation stack
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="AddCar" component={AddCar} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen
          name="HomeScreen"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Booking"
          component={Booking}
          options={{headerShown:true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
