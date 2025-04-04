import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Linking,
  ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import MapIcon from "../assets/map.svg";
import IcBack from "../assets/ic_back.svg";
import { Pressable } from "react-native";



const ResultNearBy = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ResultNearBy">
    >();
  const route = useRoute<RouteProp<RootStackParamList, "ResultNearBy">>();
  const { places } = route.params; // ✅ รับข้อมูลสถานที่จาก Loading

  // 🔹 ฟังก์ชันเปิด Google Maps
  const openGoogleMaps = (lat?: number, lon?: number, name?: string) => {
    if (lat && lon) {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
      );
    } else if (name) {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          name
        )}`
      );
    } else {
      alert("ไม่พบข้อมูลพิกัดของสถานที่นี้");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView />
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        >
          <IcBack width={24} height={24} />
        </Pressable>
        <Text style={styles.title}>สถานที่ใกล้คุณ</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* 🔹 แสดงผลข้อมูลจาก API */}
        {places.map((place, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: "https://placehold.co/400x300" }}
              style={styles.image}
            />

            <View style={styles.infoContainer}>
              <Text style={styles.placeName}>{place.name}</Text>
              <View style={styles.details}>
                <MapIcon style={{ marginTop: 4 }} width={14} height={14} />
                <Text style={styles.description}>{place.address}</Text>
              </View>

              {/* ปุ่มค้นหาเส้นทาง */}
              <TouchableOpacity
                style={styles.routeButton}
                onPress={() => openGoogleMaps(place.lat, place.lon, place.name)}
              >
                <Text style={styles.routeText}>ค้นหาเส้นทาง</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    position: "absolute",
    left: 30,
    top: 72,
    zIndex: 10,
  },
  
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    borderBottomWidth: 0,
    borderBottomColor: Color.colorWhitesmoke_300,
  },
  title: {
    fontSize: 30,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  resultBox: {
    width: "100%",
    padding: 20,
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: Border.br_xl,
    marginBottom: 24,
    elevation: 5,
    shadowColor: "#000",
  },
  resultText: {
    color: "#828282",
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
  },
  card: {
    backgroundColor: Color.colorWhitesmoke_200,
    borderRadius: Border.br_base,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
  },
  image: {
    width: Dimensions.get("screen").width,
    height: 200,
  },
  infoContainer: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: 8,
    flex: 1,
    gap: 5,
  },
  placeName: {
    fontSize: 25,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  description: {
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
  },
  details: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  routeButton: {
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 10,
    borderRadius: Border.br_base,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    marginTop: 10,
  },
  routeText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
  },
  back: {
    width: "30%",
    backgroundColor: "#B7B7B7",
    marginBottom: 40,
  },
});

export default ResultNearBy;
