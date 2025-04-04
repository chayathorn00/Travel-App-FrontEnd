import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { BASE_URL } from "../config";

const LoadingNearBy = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Loading">>();
  const route = useRoute<RouteProp<RootStackParamList, "Loading">>();
  const {
    selectedOption,
    selectedPlan,
    selectedDistance,
    butget,
    selectedActivities,
    latitude,
    longitude,
  } = route.params;

  const [places, setPlaces] = useState<any[]>([]); // เก็บข้อมูลจาก API
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    // ✅ เช็คว่ามีพิกัดหรือไม่
    const useLatLon =
      latitude !== undefined &&
      latitude !== null &&
      longitude !== undefined &&
      longitude !== null;

    const apiURL = useLatLon
      ? `${BASE_URL}/search_nearby?latitude=${latitude}&longitude=${longitude}&radius=200`
      : `${BASE_URL}/search_nearby?postcode=12120&radius=200m`;

    axios
      .get(apiURL)
      .then((response) => {
        setPlaces(response.data.data); // ✅ เก็บข้อมูลสถานที่
        setIsLoading(false);

        // ✅ ไปหน้า Result พร้อมส่งข้อมูล
        navigation.replace("ResultNearBy", {
          selectedOption,
          selectedPlan,
          selectedDistance,
          butget,
          selectedActivities,
          places: response.data.data, // ✅ ส่งข้อมูลสถานที่ไป Result
        });
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
        setIsLoading(false);
      });
  }, [navigation, latitude, longitude]);

  return (
    <ImageBackground
          source={require("../assets/bg_qa_1.jpg")}
          style={styles.container}
        >
          <Image source={require("../assets/loading.gif")} style={styles.gif} />
          <Text style={styles.title}>ขอให้สนุกกับการเดินทาง</Text>
          <Text style={styles.subtitle}>
            {`รอสักครู่ AI กำลังประมวลผล\nเพื่อค้นหาสถานที่ที่เหมาะกับคุณ`}
          </Text>
    
          {/* {isLoading && (
            <ActivityIndicator size="large" color={Color.colorCornflowerblue} />
          )} */}
        </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FontSize.size_xl,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    textAlign: "center",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
    color: "#858585",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  gif: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default LoadingNearBy;
