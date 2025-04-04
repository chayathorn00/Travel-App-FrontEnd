import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { LogBox, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Camera } from "expo-camera";

// Screens
import SplashScreen from "./screens/SplashScreen";
import Auth from "./screens/Auth";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import QA1 from "./screens/QA1";
import QA2 from "./screens/QA2";
import QA3 from "./screens/QA3";
import QA4 from "./screens/QA4";
import Loading from "./screens/Loading";
import LoadingNearBy from "./screens/LoadingNearBy";
import Result from "./screens/Result";
import ResultNearBy from "./screens/ResultNearBy";
import Favorite from "./screens/Favorite";
import HomePage from "./screens/HomePage";
import Profile from "./screens/Profile";
import ProfileSetting from "./screens/ProfileSetting";
import ProfilePicture from "./screens/ProfilePicture";
import HistoryResult from "./screens/HistoryResult";

LogBox.ignoreAllLogs(true);

export type RootStackParamList = {
  Splash: undefined;
  QA1: undefined;
  QA2: { selectedOption: string };
  QA3: { selectedOption: string; selectedPlan: number };
  QA4: {
    selectedOption: string;
    selectedPlan: number;
    selectedDistance: number;
    butget: string;
  };
  Loading: {
    selectedOption: string;
    selectedPlan: number;
    selectedDistance: number;
    butget: string;
    selectedActivities: string[];
    latitude?: number | null;
    longitude?: number | null;
  };
  LoadingNearBy: {
    selectedOption: string;
    selectedPlan: number;
    selectedDistance: number;
    butget: string;
    selectedActivities: string[];
    latitude?: number | null;
    longitude?: number | null;
  };
  Result: {
    selectedOption: string;
    selectedPlan: number;
    selectedDistance: number;
    butget: string;
    selectedActivities: string[];
    account_id: number;
  };
  ResultNearBy: {
    selectedOption: string;
    selectedPlan: number;
    selectedDistance: number;
    butget: string;
    selectedActivities: string[];
    places: Place[];
  };
  Favorite: undefined;
  HomePage: undefined;
  Profile: undefined;
  ProfileSetting: undefined;
  ProfilePicture: undefined;
  Auth: undefined;
  SignIn: undefined;
  SignUp: undefined;
  HistoryResult: undefined;
};

type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  icon?: string;
  tag: string[];
  type: string;
  url: string;
  address: string;
  tel?: string;
  contributor?: string;
  verified: boolean;
  obsoleted: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: "#00000080",
          borderTopWidth: 0,
        },
        tabBarInactiveTintColor: "#ffffff",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";
          if (route.name === "HomeTabs") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Favorite") {
            iconName = focused ? "heart" : "heart-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTabs" component={HomePage} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const App = () => {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("./assets/fonts/Nunito-ExtraBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "OleoScriptSwashCaps-Regular": require("./assets/fonts/OleoScriptSwashCaps-Regular.ttf"),
    "MNNangKaiThot": require("./assets/fonts/MNNangKaiThot.ttf"),
    "EkkamaiNewBold": require("./assets/fonts/EkkamaiNew-Bold.ttf"),
    "EkkamaiNewThin": require("./assets/fonts/EkkamaiNew-Thin.ttf"),
    "EkkamaiNewRegular": require("./assets/fonts/EkkamaiNew-Regular.ttf"),
    "PrintAble4UBoldItalic": require("./assets/fonts/PrintAble4UBoldItalic.ttf"),
    "PrintAble4UItalic": require("./assets/fonts/PrintAble4UItalic.ttf"),
    "PrintAble4URegular": require("./assets/fonts/PrintAble4URegular.ttf"),
    "PrintAble4UBold": require("./assets/fonts/PrintAble4UBold.ttf"),
    "KanitThin": require("./assets/fonts/Kanit-Thin.ttf"),
    "KanitSemiBold": require("./assets/fonts/Kanit-SemiBold.ttf"),
    "KanitRegular": require("./assets/fonts/Kanit-Regular.ttf"),
    "KanitMedium": require("./assets/fonts/Kanit-Medium.ttf"),
    "KanitLight": require("./assets/fonts/Kanit-Light.ttf"),
    "KanitExtraBold": require("./assets/fonts/Kanit-ExtraBold.ttf"),
    "KanitBold": require("./assets/fonts/Kanit-Bold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="QA1" component={QA1} />
        <Stack.Screen name="QA2" component={QA2} />
        <Stack.Screen name="QA3" component={QA3} />
        <Stack.Screen name="QA4" component={QA4} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="LoadingNearBy" component={LoadingNearBy} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="ResultNearBy" component={ResultNearBy} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
        <Stack.Screen name="ProfilePicture" component={ProfilePicture} />
        <Stack.Screen name="HistoryResult" component={HistoryResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
