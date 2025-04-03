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
import Ionicons from "react-native-vector-icons/Ionicons";

const QA2 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "QA2">>();
  const route = useRoute<RouteProp<RootStackParamList, "QA2">>();
  const { selectedOption } = route.params;

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
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("../assets/6fbc45fd-8842-4131-ac3c-b919eff34c6b.jpg")}
        style={styles.container}
        imageStyle={{ opacity: 0.7 }}
        resizeMode="cover"
      >
        <SafeAreaView />
        <Header page="2" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.detailContainer}>
            <Progress progress="50" />
            <Text style={styles.title}>{`คุณกำลังวางแผน\nการเดินทางแบบไหน?`}</Text>
            <View style={styles.optionGrid}>
              {travelPlans.map((plan, index) => {
                const isSelected = selectedPlan === plan.traveling_id;
                const IconComponent =
                  index === 0 ? UserProfile :
                  index === 1 ? Team :
                  index === 2 ? Heart : Friend;

                return (
                  <TouchableOpacity
                    key={plan.traveling_id}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedPlan(plan.traveling_id)}
                  >
                    <IconComponent
                      width={24}
                      height={24}
                      stroke={isSelected ? Color.colorWhite : Color.colorBlack}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {plan.traveling_choice}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle" size={40} color="#5893d8" />
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.arrowButton, !selectedPlan && styles.buttonDisabled]}
          onPress={() => {
            if (selectedPlan) {
              navigation.navigate("QA3", {
                selectedOption,
                selectedPlan,
              });
            }
          }}
          disabled={!selectedPlan}
        >
          
          <Ionicons name="arrow-forward-circle" size={40} color={selectedPlan ? "#5893d8" : "#999"} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    position: "relative",
    zIndex: 0,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  detailContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: FontFamily.EkkamaiNewBold,
    color: Color.colorBlack,
    marginBottom: 20,
    textAlign: "center",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  option: {
    width: "45%",
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 24,
    borderRadius: Border.br_base,
    alignItems: "center",
    marginBottom: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: Color.colorCornflowerblue,
    backgroundColor: Color.colorCornflowerblue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  optionText: {
    fontSize: FontSize.size_mini,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    marginTop: 10,
  },
  optionTextSelected: {
    color: Color.colorWhite,
  },
  arrowButton: {
    position: "absolute",
    top: 50,
    right: 40,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 40,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  
});

export default QA2;
