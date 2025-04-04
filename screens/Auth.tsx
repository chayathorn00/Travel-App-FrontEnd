import * as React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Color, Border, FontFamily, FontSize } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const Auth = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require("../assets/first.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.appTitle}>NexTrip</Text>
      </View>
      <View style={styles.sectionPosition}>
        <Text style={styles.subtitle}>
          <Text style={styles.letThe}>ให้เรา{"\n"}</Text>
          <Text style={styles.feelingTakeYou}>จัดหาที่{"\n"}</Text>
          <Text style={styles.travel}>ท่องเที่ยว</Text>
        </Text>

        <View style={styles.buttonContainer}>
          {/* ปุ่ม Sign Up */}
          <TouchableOpacity
            style={styles.signUpWrapper}
            onPress={() => navigation.navigate("SignUp")} // ไปหน้าสมัครสมาชิก (SignUp)
          >
            <Text style={styles.signUpText}>ลงทะเบียน</Text>
          </TouchableOpacity>

          {/* ปุ่ม Sign In */}
          <TouchableOpacity
            style={styles.signInWrapper}
            onPress={() => navigation.navigate("SignIn")} // ไปหน้าล็อกอิน (SignIn)
          >
            <Text style={styles.signInText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // ทำให้ background เต็มจอ
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // เพิ่มความเข้มให้พื้นหลัง
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // ดันเนื้อหาขึ้นด้านบน
    paddingHorizontal: 20,
    position: "absolute",
    top: "15%",
  },
  appTitle: {
    fontSize: 64,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    color: Color.colorWhite,
    textAlign: "center",
    marginVertical: 50,
  },
  letThe: {
    fontSize: 35,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "right",
  },
  feelingTakeYou: {
    fontSize: 40,
    fontFamily: FontFamily.KanitRegular,
    fontWeight: "500",
    textAlign: "right",
  },
  travel: {
    fontSize: 50,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "right",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  userProfile: {
    position: "absolute",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  signUpWrapper: {
    flex: 1,
    height: 38,
    backgroundColor: Color.colorCornflowerblue,
    borderRadius: Border.br_base,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  signInWrapper: {
    flex: 1,
    height: 38,
    backgroundColor: Color.colorCornflowerblue,
    borderRadius: Border.br_base,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
  },
  signUpText: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
    textAlign: "center",
    elevation: 5,
    shadowColor: "#000",
  },
  signInText: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
    textAlign: "center",
    elevation: 5,
    shadowColor: "#000",
  },
  sectionPosition: {
    position: "absolute",
    bottom: "12%",
    paddingHorizontal: 40,
  },
});

export default Auth;
