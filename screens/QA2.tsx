import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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
import UserProfile from "../assets/User-Profile.svg";
import Team from "../assets/family.svg";
import Heart from "../assets/Heart.svg";
import Friend from "../assets/users-profiles-01.svg";
import { BASE_URL } from "../config";

const QA2 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "QA2">>();
  const route = useRoute<RouteProp<RootStackParamList, "QA2">>();
  const { selectedOption } = route.params; // ✅ รับค่าจาก QA1

  const [travelPlans, setTravelPlans] = useState<
    { traveling_id: number; traveling_choice: string }[]
  >([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/qa_traveling`)
      .then((response) => {
        setTravelPlans(response.data);
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
        page="2"
        previous={() => {
          navigation.goBack();
        }}
        next={
          selectedPlan
            ? () => {
                navigation.navigate("QA3", {
                  selectedOption, // ✅ ส่งค่าที่เลือกจาก QA1
                  selectedPlan, // ✅ ส่งค่าที่เลือกจาก QA2
                });
              }
            : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.optionContainer,{marginBottom: 100}]}>
          <Progress progress="50" />
          <Text
            style={styles.title}
          >{`คุณวางแผน\nการเดินทางแบบไหน ?`}</Text>
          <View style={styles.optionGrid}>
            {travelPlans.map((plan, index) => (
              <TouchableOpacity
                key={plan.traveling_id}
                style={[
                  styles.option,
                  selectedPlan === plan.traveling_id && styles.optionSelected,
                ]}
                onPress={() => setSelectedPlan(plan.traveling_id)}
              >
                {index === 0 ? (
                  <UserProfile
                    width={24}
                    height={24}
                    stroke={
                      selectedPlan === plan.traveling_id
                        ? Color.colorWhite
                        : Color.colorBlack
                    }
                  />
                ) : index === 1 ? (
                  <Team
                    width={24}
                    height={24}
                    stroke={
                      selectedPlan === plan.traveling_id
                        ? Color.colorWhite
                        : Color.colorBlack
                    }
                  />
                ) : index === 2 ? (
                  <Heart
                    width={24}
                    height={24}
                    stroke={
                      selectedPlan === plan.traveling_id
                        ? Color.colorWhite
                        : Color.colorBlack
                    }
                  />
                ) : (
                  <Friend
                    width={24}
                    height={24}
                    stroke={
                      selectedPlan === plan.traveling_id
                        ? Color.colorWhite
                        : Color.colorBlack
                    }
                  />
                )}

                <Text
                  style={[
                    styles.optionText,
                    selectedPlan === plan.traveling_id &&
                      styles.optionTextSelected,
                  ]}
                >
                  {plan.traveling_choice}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  optionContainer: {
    width: "100%",
    alignItems: "center",
  },
  option: {
    width: "43%",
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 24,
    borderRadius: Border.br_base,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: Color.colorCornflowerblue,
    backgroundColor: Color.colorCornflowerblue,
  },
  optionText: {
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
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
  optionTextSelected: {
    color: Color.colorWhite,
  },
});

export default QA2;
