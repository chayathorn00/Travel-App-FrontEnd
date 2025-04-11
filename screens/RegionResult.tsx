import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
  ImageBackground,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import MapIcon from "../assets/map.svg";
import { BASE_URL } from "../config";
import IcBack from "../assets/ic_back.svg";
import axios from "axios";

// 🟢 ประกาศ Type สำหรับข้อมูลที่ดึงมา
type ResultItem = {
  results_id: number;
  account_id: number;
  event_name: string;
  event_description: string;
  open_day: string;
  results_location: string;
  time_schedule: string;
  results_img_url: string;
  distance: string;
};

type ProviceData = {
  geography_id: number;
  place_id: number;
  place_map: string;
  place_name: string;
  place_picture: string;
  province_th: string;
};

const RegionResult = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "RegionResult">
    >();
  const route = useRoute<RouteProp<RootStackParamList, "RegionResult">>();
  const { region } = route.params;

  // 🟢 สร้าง state สำหรับข้อมูลและสถานะโหลด
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<ProviceData[]>([]);

  // 🔹 Fetch Data จาก API
  useEffect(() => {
    fetchPlacesByRegion(region);
  }, [region]);

  const fetchPlacesByRegion = async (regionId: number) => {
    try {
      const regionMap = [2, 1, 6, 3]; // index ตามลำดับ: ภาคกลาง, เหนือ, ใต้, ตะวันออก

      const response = await axios.get(
        `${BASE_URL}/province/${regionMap[regionId]}`
      );
      console.log("📍 ดึงข้อมูลสถานที่:", response.data);
      setLoading(false);
      setPlaces(response.data);
    } catch (error) {
      setLoading(false);
      console.error("❌ ดึงข้อมูลสถานที่ผิดพลาด:", error);
      //Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลสถานที่ท่องเที่ยวได้");
    }
  };
  // 🔹 ฟังก์ชันเปิด Google Maps
  const openGoogleMaps = (location: string) => {
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`
    );
  };

  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView />
      <View style={styles.header}>
        <Pressable
          onPress={async () => {
            navigation.pop();
          }}
        >
          <IcBack width={24} height={24} />
        </Pressable>
        <Text style={styles.title}>แนะนำให้ไป</Text>
        <View />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Color.colorCornflowerblue}
          style={styles.loading}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {places.length > 0 ? (
            places.map((place) => (
              <View key={place.place_id} style={styles.card}>
                <Image
                  source={{ uri: place.place_picture }}
                  style={styles.image}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.placeName}>{place.place_name}</Text>
                  {/* <Text style={styles.description}>
                    {place.event_description}
                  </Text> */}
                  <Text style={styles.detailText}>📍 {place.province_th}</Text>
                  {/* <Text style={styles.detailText}>
                    ⏰ {place.time_schedule}
                  </Text>
                  <Text style={styles.detailText}>🚶 {place.distance}</Text> */}

                  <TouchableOpacity
                    style={styles.routeButton}
                    onPress={() => openGoogleMaps(place.place_name + ' ' + place.province_th)}
                  >
                    <Text style={styles.routeText}>ดูเส้นทาง</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noResult}>ไม่พบสถานที่</Text>
          )}
        </ScrollView>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 30,
    borderBottomWidth: 0,
    borderBottomColor: Color.colorWhitesmoke_300,
  },
  title: {
    fontSize: 30,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
    right: 10,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: Color.colorWhitesmoke_200,
    borderRadius: Border.br_base,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 16,
    shadowColor: "#000",
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: 16,
  },
  placeName: {
    fontSize: 25,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  description: {
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
    marginVertical: 5,
  },
  detailText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    marginTop: 2,
  },
  routeButton: {
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 10,
    borderRadius: Border.br_base,
    alignItems: "center",
    width: "50%",
    alignSelf: "center",
    marginTop: 10,
  },
  routeText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
  },
  back: {
    marginBottom: 40,
  },
  noResult: {
    textAlign: "center",
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    color: "gray",
    marginVertical: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegionResult;
