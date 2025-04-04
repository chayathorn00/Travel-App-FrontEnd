import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; // นำเข้า Bottom Tabs Navigator
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import { Camera } from "expo-camera";

// นำเข้าหน้าจอต่างๆ
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
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
LogBox.ignoreAllLogs(true);

export type RootStackParamList = {
  QA1: undefined;
  QA2: { selectedOption: string }; // ✅ รับค่าจาก QA1
  QA3: { selectedOption: string; selectedPlan: number }; // ✅ รับค่าจาก QA1 + QA2
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
    account_id: number; // ✅ เพิ่ม account_id
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

const Stack = createNativeStackNavigator();
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
  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);

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
    "MNNangKaiThot": require ("./assets/fonts/MNNangKaiThot.ttf"),
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
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="QA1"
              component={QA1}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="QA2"
              component={QA2}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="QA3"
              component={QA3}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="QA4"
              component={QA4}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Loading"
              component={Loading}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoadingNearBy"
              component={LoadingNearBy}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Result"
              component={Result}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResultNearBy"
              component={ResultNearBy}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomePage"
              component={HomePage} // แทนที่ด้วย Bottom Tabs
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
            {/* นำ MyTabs มาใช้เพื่อแสดงแท็บในหน้าที่ต้องการ */}
            <Stack.Screen
              name="ProfileSetting"
              component={ProfileSetting}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfilePicture"
              component={ProfilePicture}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HistoryResult"
              component={HistoryResult}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </>
  );
};

export default App;
