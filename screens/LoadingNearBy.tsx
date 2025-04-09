import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { BASE_URL } from "../config";

const LoadingNearBy = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "LoadingNearBy">>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      setIsLoading(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง");
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      try {
        const res = await axios.get(
          `${BASE_URL}/search_nearby?latitude=${latitude}&longitude=${longitude}&radius=200`
        );
        const places = res.data.data;

        navigation.replace("ResultNearBy", { places }); // ✅ แบบนี้ไม่ error แล้ว

      } catch (error) {
        console.error("❌ Error fetching data:", error);
        Alert.alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <Image source={require("../assets/loading.gif")} style={styles.gif} />
      <Text style={styles.title}>ขอให้สนุกกับการเดินทาง</Text>
      <Text style={styles.subtitle}>
        {`รอสักครู่ AI กำลังค้นหาสถานที่ใกล้คุณ`}
      </Text>
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
