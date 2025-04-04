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

const HomePage = () => {
  const [page, setPage] = useState<number>(0);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
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
        console.error("❌ Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const data = ["ภาคกลาง", "ภาคเหนือ", "ภาคใต้", "ภาคตะวันออก"];
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
      console.error("❌ Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchProfile(); // โหลดข้อมูลใหม่เมื่อเข้าหน้านี้
    }, [])
  );
  
  
  const changeTab = (tab: number) => {
    setPage(tab);
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
              navigation.navigate("LoadingNearBy", {
                selectedOption: "0",
                selectedPlan: 0,
                selectedDistance: 0,
                butget: "0",
                selectedActivities: [],
              });
            } else {
              Alert.alert("ตำแหน่งไม่พร้อม", "กรุณาอัพเดทตำแหน่งในหน้าโปรไฟล์");
            }
          }}
          activeOpacity={0.7}
        >
          <View>
            <View style={styles.recommaendContainner}>
              <Text style={styles.title}>ใกล้กับคุณ</Text>
            </View>
            <Image
              source={require("../assets/nearby.png")}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>

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
            <Image
              source={require("../assets/history.png")}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>

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
        {page === 0 ? (
          <Image
            source={require("../assets/center.png")}
            style={styles.imageContent}
          />
        ) : page === 1 ? (
          <Image
            source={require("../assets/north.png")}
            style={styles.imageContent}
          />
        ) : page === 2 ? (
          <Image
            source={require("../assets/south.png")}
            style={styles.imageContent}
          />
        ) : (
          <Image
            source={require("../assets/east.png")}
            style={styles.imageContent}
          />
        )}

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
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 60,
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
    fontFamily: FontFamily.nunitoRegular,
    color: Color.gray1,
  },
  title: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  scrollView: {
    padding: 24,
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
    width: "35%",
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
    paddingHorizontal: 4,
  },
  category: {
    backgroundColor: Color.colorWhite,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Border.br_81xl,
    marginVertical: 4,
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
    top: 11,
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
});

export default HomePage;
