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
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { BASE_URL } from "../config";


const Loading = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Loading">>();
  const route = useRoute<RouteProp<RootStackParamList, "Loading">>();

  const {
    selectedOption,
    selectedPlan,
    selectedDistance,
    butget,
    selectedActivities,
    selectedEmotion
  } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Permission denied");
        return;
      }

      console.log("📡 กำลังดึงพิกัด...");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log(
        "📌 ได้รับพิกัด:",
        location.coords.latitude,
        location.coords.longitude
      );
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setIsLoading(true);

      const payload = {
        latitude,
        longitude,
        trip_id: selectedPlan,
        distance_id: selectedDistance,
        value_id: butget,
        location_interest_id: Number(selectedOption),
        activity_id: selectedActivities.join(','),
        emotional_id: Number(selectedEmotion),
      };

      console.log("📤 Sending data:", payload);

      axios
        .post(`${BASE_URL}/qa_transaction`, payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("✅ Response:", response.data);

          if (response.data.success) {
            const { account_id } = response.data.data;
            navigation.replace("Result", {
              selectedOption,
              selectedPlan,
              selectedDistance,
              butget,
              selectedActivities,
              account_id,
            });
          } else {
            console.error("❌ API error:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("❌ Network error:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [latitude, longitude]);

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
    lineHeight: 25,
  },
  gif: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default Loading;
