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

const Result = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Result">>();
  const route = useRoute<RouteProp<RootStackParamList, "Result">>();
  const { account_id } = route.params; // ✅ ดึงค่า account_id จาก params

  // 🟢 สร้าง state สำหรับข้อมูลและสถานะโหลด
  const [filteredResults, setFilteredResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Data จาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/qa_results`);
        const data: ResultItem[] = await response.json();

        // ✅ กรองเฉพาะข้อมูลที่ account_id ตรงกัน
        const filteredData = data.filter(
          (item) => item.account_id === account_id
        );
        setFilteredResults(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account_id]);

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
          
        </Pressable>
        <Text style={styles.title}>หวังว่าคุณจะชอบ :)</Text>
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
          <View style={[{marginBottom: 100}]}>
          {filteredResults.length > 0 ? (
            filteredResults.map((place) => (
              <View key={place.results_id} style={styles.card}>
                <Image
                  source={{ uri: place.results_img_url }}
                  style={styles.image}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.placeName}>{place.event_name}</Text>
                  <Text style={styles.description}>
                    {place.event_description}
                  </Text>
                  <Text style={styles.detailText}>
                    📍 {place.results_location}
                  </Text>
                  <Text style={styles.detailText}>
                    ⏰ {place.time_schedule}
                  </Text>
                  <Text style={styles.detailText}>🚶 {place.distance}</Text>

                  <TouchableOpacity
                    style={styles.routeButton}
                    onPress={() => openGoogleMaps(place.event_name)}
                  >
                    <Text style={styles.routeText}>ดูเส้นทาง</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noResult}>
              ไม่พบสถานที่ที่ตรงกับบัญชีของคุณ
            </Text>
          )}

          {/* ปุ่มกลับหน้าแรก */}
          <TouchableOpacity
            onPress={async () => {
              const token = await AsyncStorage.getItem("userToken");
              if (token) {
                navigation.navigate("HomePage");
              } else {
                navigation.navigate("Auth");
              }
            }}
            style={[styles.routeButton, styles.back]}
          >
            <Text style={styles.routeText}>ดูข้อมูลเพิ่มเติม</Text>
          </TouchableOpacity>
          </View>
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

export default Result;
