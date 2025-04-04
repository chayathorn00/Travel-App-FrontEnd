import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import axios from "axios"; // ✅ นำเข้า axios สำหรับเรียก API
import User from "../assets/user.svg";
import Password2 from "../assets/password-2.svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import { BASE_URL } from "../config";
import Header from "../component/Header";
import IcBack from "../assets/ic_back.svg";

const SignUp = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ✅ เก็บค่าที่ผู้ใช้กรอก
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      const message = "กรุณากรอกข้อมูลให้ครบถ้วน";
      Platform.OS === "web" ? window.alert(message) : Alert.alert(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
      Platform.OS === "web" ? window.alert(message) : Alert.alert(message);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        account_email: email,
        account_password: password,
        confirm_password: confirmPassword,
      });

      if (response.status === 201) {
        const message = "สมัครสมาชิกสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว";
        Platform.OS === "web"
          ? window.alert(message)
          : Alert.alert(message, "", [
              { text: "ตกลง", onPress: () => navigation.navigate("SignIn") },
            ]);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      const message = "เกิดข้อผิดพลาด ไม่สามารถสมัครสมาชิกได้";
      Platform.OS === "web" ? window.alert(message) : Alert.alert(message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/register.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}></View>
      <Pressable
        onPress={() => {
          navigation.navigate("Auth");
        }}
        style={styles.backBtn}
      >
        <IcBack width={24} height={24} />
      </Pressable>
      <View>
        <Text style={styles.title}>ลงทะเบียนสมัครสมาชิก</Text>

        <View style={styles.container}>
          {/* Input Email */}
          <View style={styles.inputContainer}>
            <User width={24} height={24} style={styles.icon} />
            <TextInput
              placeholder="อีเมล์"
              placeholderTextColor={Color.colorGray_100}
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Input Password */}
          <View style={styles.inputContainer}>
            <Password2 width={24} height={24} style={styles.icon} />
            <TextInput
              placeholder="รหัสผ่าน"
              placeholderTextColor={Color.colorGray_100}
              style={styles.input}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Input Confirm Password */}
          <View style={styles.inputContainer}>
            <Password2 width={24} height={24} style={styles.icon} />
            <TextInput
              placeholder="ยืนยันรหัสผ่าน"
              placeholderTextColor={Color.colorGray_100}
              style={styles.input}
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        {/* ปุ่ม Sign Up */}
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
          <Text style={styles.buttonText}>ลงทะเบียน</Text>
        </TouchableOpacity>
        {/* ปุ่ม Back */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    width: "85%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 35,
    borderRadius: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
    marginBottom: 30,
    left: 0,
    top: -25,
  },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
    width: "100%",
    backgroundColor: Color.colorGainsboro_100,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#00000038",
    elevation: 10,
    shadowColor: "#000",
    borderRadius: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    paddingVertical: 12,
    fontSize: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
    backgroundColor: Color.colorCornflowerblue,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignSelf: "center",
    elevation: 10,
    shadowColor: "#000",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
    backgroundColor: Color.colorGray_100,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
  },
});

export default SignUp;
