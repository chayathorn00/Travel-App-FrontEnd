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

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

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
        budget: butget,
        location_interest_id: selectedOption,
        activity_interest_id: selectedActivities.map(Number),
      };

      axios
        .post(`${BASE_URL}/qa_transaction`, payload, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
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
      source={require("../assets/6fbc45fd-8842-4131-ac3c-b919eff34c6b.jpg")}
      style={styles.container}
      imageStyle={{ opacity: 0.7 }}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <Image source={require("../assets/loading.gif")} style={styles.gif} />
        <Text style={styles.title}>ขอให้สนุกกับการเดินทาง</Text>
        <Text style={styles.subtitle}>
          {`รอสักครู่ AI กำลังประมวลผล\nเพื่อค้นหาสถานที่ที่เหมาะกับคุณ`}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: FontSize.size_xl,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.KanitRegular,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 30,
  },
  gif: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});

export default Loading;
