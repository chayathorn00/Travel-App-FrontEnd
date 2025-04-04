import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import Header from "../component/Header";
import Progress from "../component/Progress";
import Bank from "../assets/Bank.svg";
import { BASE_URL } from "../config";

const QA3 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "QA3">>();
  const route = useRoute<RouteProp<RootStackParamList, "QA3">>();
  const { selectedOption, selectedPlan } = route.params; // ✅ รับค่าจาก QA1 และ QA2

  const [distances, setDistances] = useState<
    { distance_id: number; distance_km: string }[]
  >([]);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [butget, setButget] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/qa_distance`)
      .then((response) => {
        setDistances(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView />
      <Header
        page="3"
        previous={() => {
          navigation.goBack();
        }}
        next={
          selectedDistance && butget
            ? () => {
                navigation.navigate("QA4", {
                  selectedOption, // ✅ ส่งค่าที่เลือกจาก QA1
                  selectedPlan, // ✅ ส่งค่าที่เลือกจาก QA2
                  selectedDistance, // ✅ ส่งค่าที่เลือกจาก QA3
                  butget, // ✅ ส่งค่าที่เลือกจาก QA3
                });
              }
            : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Progress progress="75" />
        <Text style={styles.title}>ระยะทางในการเดินทาง</Text>

        <View style={styles.optionGrid}>
          {distances.map((distance) => (
            <TouchableOpacity
              key={distance.distance_id}
              style={[
                styles.option,
                selectedDistance === distance.distance_id &&
                  styles.optionSelected,
              ]}
              onPress={() => setSelectedDistance(distance.distance_id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedDistance === distance.distance_id &&
                    styles.optionTextSelected,
                ]}
              >
                {distance.distance_km}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* งบประมาณ */}
        <Text style={styles.title}>งบประมาณในการเดินทาง</Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, ""); // ✅ ลบอักขระที่ไม่ใช่ตัวเลข
              setButget(numericValue);
            }}
            value={butget} // ✅ แสดงค่าใน input
            keyboardType="numeric"
            style={styles.input}
            placeholder="กรอกงบประมาณ"
          />
          <Bank width={20} height={20} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  scrollContainer: {
    paddingBottom: 100, // ป้องกันปุ่มถูกบัง
  },
  title: {
    fontSize: 30,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    marginBottom: 30,
    textAlign: "center",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  option: {
    width: "45%",
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 10,
    borderRadius: Border.br_base,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: Color.colorCornflowerblue,
    backgroundColor: Color.colorCornflowerblue,
    
  },
  optionText: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  optionTextSelected: {
    color: Color.colorWhite,
  },
  inputContainer: {
    flexDirection: "row",
    width: "60%",
    height: 40,
    backgroundColor: Color.colorWhitesmoke_100,
    alignItems: "center",
    borderRadius: Border.br_3xs,
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: "85%",
    textAlign: "center",
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
  },
  nextButton: {
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Border.br_base,
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    right: 20,
    shadowColor: "#000",
    elevation: 5,
  },
  backButton: {
    backgroundColor: Color.colorDimgray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Border.br_base,
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    left: 20,
    shadowColor: "#000",
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: Color.colorGray_100,
  },
  buttonText: {
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.KanitRegular,
    fontWeight: "700",
    color: Color.colorWhite,
  },
});

export default QA3;
