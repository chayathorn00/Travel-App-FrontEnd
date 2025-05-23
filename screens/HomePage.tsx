import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App"; // นำเข้า Type ของ Stack Navigator
import { Color, FontFamily, FontSize, Border, Padding } from "../GlobalStyles";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "../config";
import * as Location from "expo-location";

type DecodedToken = {
  account_id: number;
  account_email: string;
};

type ProfileData = {
  account_id: number;
  account_email: string;
  account_name: string;
  account_gender: string;
  account_birthday: string;
  account_picture: string;
  account_telephone: string;
  latitude: number;
  longitude: number;
};

type ProviceData = {
  geography_id: number;
  place_id: number;
  place_map: string;
  place_name: string;
  place_picture: string;
  province_th: string;
};

type QAResult = {
  results_id: number;
  event_name: string;
  event_description: string;
  open_day: string;
  results_location: string;
  time_schedule: string;
  results_img_url: string;
  distance: string;
  created_at: string;
};


const HomePage = () => {
  const [page, setPage] = useState<number>(0);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<ProviceData[]>([]);
  const [qaResults, setQaResults] = useState<QAResult[]>([]);


  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchProfileAndPlaces = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.warn("❌ No Token Found. Redirecting to Auth.");
          navigation.replace("Auth");
          return;
        }
        const decoded: DecodedToken = jwtDecode(token);
        const response = await axios.get(
          `${BASE_URL}/accounts_list/${decoded.account_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data);
        
        // ✅ เพิ่มตรงนี้ โหลดข้อมูลภาคกลาง (regionId = 2)
        await fetchPlacesByRegion(2);
        setPage(0); // ตั้งให้เริ่มต้นที่ภาคกลาง
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้");
        console.error("❌ Profile Fetch Error Home:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileAndPlaces();
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.warn("❌ No Token Found. Redirecting to Auth.");
          navigation.replace("Auth");
          return;
        }
        const decoded: DecodedToken = jwtDecode(token);
        console.log("📩 JWT Payload:", decoded);
        const response = await axios.get(
          `${BASE_URL}/accounts_list/${decoded.account_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("📩 response:", response.data);
        setProfile(response.data); // ✅ อัปเดตโปรไฟล์
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้");
        console.error("❌ Profile Fetch Error Home:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    
  }, []);
  useEffect(() => {
    const fetchQAResults = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/qa_results`);
        const sorted = res.data.sort(
          (a: QAResult, b: QAResult) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setQaResults(sorted.slice(0, 5));
      } catch (error) {
        console.error("❌ Error loading QA Results:", error);
      }
    };
  
    fetchQAResults();
  }, []);
  const fetchPlacesByRegion = async (regionId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/province/${regionId}`);
      console.log("📍 ดึงข้อมูลสถานที่:", response.data);
      setPlaces(response.data);
    } catch (error) {
      console.error("❌ ดึงข้อมูลสถานที่ผิดพลาด:", error);
      //Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลสถานที่ท่องเที่ยวได้");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
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

    fetchLocation();
  }, []);

  // ✅ ตรวจสอบ Token และ Email เมื่อหน้าโหลด
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          navigation.replace("Auth"); // ❌ ไม่มี Token ให้ไปหน้า Auth
        } else {
          const storedEmail = await AsyncStorage.getItem("userEmail");
          console.log("📩 Email ที่ได้จาก AsyncStorage:", storedEmail);
          if (storedEmail) {
            setEmail(storedEmail);
          }
        }
      } catch (error) {
        console.error("❌ ตรวจสอบ Token ผิดพลาด:", error);
      }
    };

    checkAuth();
  }, []);

  const data = ["ภาคกลาง", "ภาคเหนือ", "ภาคใต้", "ภาคอีสาน"];
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.warn("❌ No Token Found. Redirecting to Auth.");
        navigation.replace("Auth");
        return;
      }
      const decoded: DecodedToken = jwtDecode(token);
      const response = await axios.get(
        `${BASE_URL}/accounts_list/${decoded.account_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้");
      console.error("❌ Profile Fetch Error Home2:", err);
    } finally {
      setLoading(false);
    }
    
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlacesByRegion(2);
      setPage(0);
      fetchProfile(); // โหลดข้อมูลใหม่เมื่อเข้าหน้านี้
    }, [])
  );

  const regionMap = [2, 1, 6, 3]; // index ตามลำดับ: ภาคกลาง, เหนือ, ใต้, ตะวันออก

  const changeTab = async (tab: number) => {
    setPage(tab);
    try {
      const response = await axios.get(
        `${BASE_URL}/province/${regionMap[tab]}`
      );
      console.log("📍 โหลดข้อมูลภาคใหม่:", response.data);
      setPlaces(response.data);
    } catch (error) {
      console.error("❌ โหลดข้อมูลภาคผิดพลาด:", error);
      //Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลภาคนี้ได้");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.colorCornflowerblue} />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView />
      {/* Header */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
        }}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          {/* Avatar พร้อมกดเพื่อไปหน้า Profile */}
          <View>
            <Image
              source={
                profile?.account_picture
                  ? { uri: profile.account_picture } // ✅ ใช้ URL ถ้ามีข้อมูล
                  : require("../assets/3d-avatars--9.png") // ✅ ใช้รูปเดิมถ้าไม่มีข้อมูล
              }
              style={styles.avatar}
            />
          </View>

          <View>
            <Text style={styles.username}>
              {profile?.account_name && profile.account_name.trim() !== ""
                ? profile.account_name
                : "ไม่ระบุ"}
            </Text>

            <Text style={styles.email}>
              {profile?.account_email || "ไม่พบอีเมล"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* รูปภาพแนะนำสถานที่ */}

        <TouchableOpacity
          onPress={() => {
            const finalLatitude = latitude || profile?.latitude;
            const finalLongitude = longitude || profile?.longitude;

            if (
              finalLatitude &&
              finalLongitude &&
              finalLatitude !== 0 &&
              finalLongitude !== 0
            ) {
              navigation.navigate("HistoryResult");
            } else {
              Alert.alert("ตำแหน่งไม่พร้อม", "กรุณาอัพเดทตำแหน่งในหน้าโปรไฟล์");
            }
          }}
          activeOpacity={0.7}
        >
          <View style={{ marginTop: 20 }}>
            <View style={styles.recommaendContainner}>
              <Text style={styles.title}>รสนิยมการเที่ยว</Text>
            </View>
            {qaResults.length === 0 ? (
              <Text style={{ fontSize: 16, fontFamily: FontFamily.KanitRegular }}>
                ไม่พบข้อมูล
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardScrollView}
              >
                {qaResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate("HistoryResult")}
                    activeOpacity={0.8}
                  >
                    <View style={styles.qaCard2}>
                      <Image
                        source={{ uri: item.results_img_url }}
                        style={styles.qaImage2}
                      />
                      <Text style={styles.qaTitle2} numberOfLines={2}>
                      📍{item.event_name}
                      </Text>
                      <Text style={styles.description}>⏰เปิด: {item.open_day}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>

        {/* หมวดหมู่ */}
        {/* หมวดหมู่ */}
        <View style={styles.categoryContainer}>
          {data.map((item, index) => (
            <TouchableOpacity
              onPress={() => changeTab(index)}
              key={index}
              style={[
                styles.category,
                {
                  backgroundColor:
                    page === index
                      ? Color.colorWhite
                      : Color.colorWhitesmoke_100,
                  shadowColor:
                    page === index ? Color.colorBlack : Color.colorWhite,
                },
              ]}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* แสดงสถานที่แนวนอน */}
        <View style={{ marginTop: 20 }}>
          {places.length === 0 ? (
            <Text style={{ fontSize: 16, fontFamily: FontFamily.KanitRegular }}>
              ไม่พบข้อมูลสถานที่ในภาคนี้
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardScrollView}
            >
              {places.slice(0, 5).map((place, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("RegionResult", {
                      region: page,
                    })
                  }
                  key={index}
                >
                  <View key={index} style={styles.placeCard}>
                    {place.place_picture && (
                      <Image
                        source={{ uri: place.place_picture }}
                        style={styles.placeImage}
                        resizeMode="cover"
                      />
                    )}
                    <Text style={styles.placeTitle}>
                      📍 {place.place_name || "ชื่อไม่พบ"}
                    </Text>

                    <Text style={styles.placeDescription}>
                      {place.province_th || "ไม่มีคำอธิบาย"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* ปุ่มไปหน้าผลลัพธ์ */}
        {/* <TouchableOpacity
          style={styles.resultButton}
          onPress={() => navigation.navigate("Favorite")}
        >
          <Text style={styles.resultText}>สถานะที่ที่คุณชอบ</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.surveyButton}
          onPress={() => navigation.navigate("QA1")} // ไปที่แบบสอบถาม
        >
          <Text style={styles.surveyText}>เริ่มทริปถัดไป</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  qaCard2: {
    width: 300,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 8,
  },
  qaImage2: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  qaTitle2: {
    marginTop: 8,
    fontSize: 20,
    fontFamily: FontFamily.KanitRegular,
    color: "#000",
  },
  qaCard: {
    width: 250,
    backgroundColor: "#FFFFFFEE",
    borderRadius: 16,
    marginRight: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  
  qaImage: {
    width: 220,
    height: 220,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  
  qaTitle: {
    fontSize: 20,
    fontFamily: FontFamily.KanitRegular,
    color: "#333",
    marginTop: 6,
    textAlign: "center",
    width: 140,
    top: 10
  },
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 30,
    borderBottomColor: Color.colorWhitesmoke_300,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 25,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  email: {
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
    color: Color.gray1,
  },
  title: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  scrollView: {
    padding: 24,
    bottom: 45,
    paddingLeft: 20,
    paddingRight: 0,
  },
  imageContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: Border.br_3xs,
  },
  imageContent: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: Border.br_3xs,
    borderBottomRightRadius: Border.br_3xs,
  },
  surveyButton: {
    width: "40%",
    marginTop: 30,
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Border.br_21xl,
    alignItems: "center",
    alignSelf: "center",
  },
  surveyText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    backgroundColor: Color.colorWhitesmoke_100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    right:10
  },
  category: {
    backgroundColor: Color.colorWhite,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Border.br_81xl,
    marginVertical: 6,
    shadowColor: Color.colorBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  categoryText: {
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  resultButton: {
    marginTop: 20,
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 12,
    borderRadius: Border.br_base,
    alignItems: "center",
  },
  resultText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
  },
  recommaendContainner: {
    position: "absolute",
    zIndex: 9,
    backgroundColor: "#FFFFFCCC",
    left: 11,
    top: 16,
    paddingVertical: 10,
    borderRadius: 50,
    paddingHorizontal: 17,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: FontSize.size_base,
    marginTop: 10,
  },
  errorText: {
    fontSize: FontSize.size_base,
    color: "red",
  },
  disabledButton: {
    opacity: 0.5,
  },
  cardScrollView: {
    paddingLeft: 6,
    paddingRight: 24,
  },
  placeCard: {
    width: 300,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 8,
  },
  placeTitle: {
    marginTop: 8,
    fontSize: 20,
    fontFamily: FontFamily.KanitRegular,
    color: "#000",
  },
  placeImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: FontFamily.KanitRegular,
    color: "#444",
    marginLeft: 4,
  },
  placeDescription: {
    fontSize: 14,
    fontFamily: FontFamily.KanitRegular,
    color: "#444",
    marginLeft: 4,
  },
  
});

export default HomePage;
