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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const QA3 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "QA3">>();
  const route = useRoute<RouteProp<RootStackParamList, "QA3">>();
  const { selectedOption, selectedPlan } = route.params; // ✅ รับค่าจาก QA1 และ QA2

  const [distances, setDistances] = useState<
    { distance_id: number; distance_km: string }[]
  >([]);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<
    { value_id: number; value_money: string }[]
  >([]);
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/qa_distance`)
      .then((response) => {
        setDistances(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .get(`${BASE_URL}/qa_value`)
      .then((response) => {
        setBudgets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching budget data:", error);
      });
  }, []);
  useEffect(() => {
    console.log("budgets from backend:", budgets); // ✅ ดูว่ามีข้อมูลไหม
  }, [budgets]);
  
  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView />
      <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={30}
      keyboardShouldPersistTaps="handled"
      >
      <Header
        page="3"
        previous={() => {
          navigation.goBack();
        }}
        next={
          selectedDistance && selectedBudget !== null
            ? () => {
                navigation.navigate("QA4", {
                  selectedOption,
                  selectedPlan,
                  selectedDistance,
                  butget: selectedBudget.toString(), // ✅ แปลงเป็น string ตามที่ TypeScript คาด
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
        <View style={styles.optionGrid}>
          {budgets.map((budget) => (
            <TouchableOpacity
              key={budget.value_id}
              style={[
                styles.option,
                selectedBudget === budget.value_id && styles.optionSelected,
              ]}
              onPress={() => setSelectedBudget(Number(budget.value_id))}

            >
              <Text
                style={[
                  styles.optionText,
                  selectedBudget === budget.value_id && styles.optionTextSelected,
                ]}
              >
                {budget.value_money}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      

      </ScrollView>
      </KeyboardAwareScrollView>
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
