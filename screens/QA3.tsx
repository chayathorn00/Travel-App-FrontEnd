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
import Ionicons from "react-native-vector-icons/Ionicons";


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
    <View style={styles.wrapper}>
  <ImageBackground
    source={require("../assets/6fbc45fd-8842-4131-ac3c-b919eff34c6b.jpg")}
    style={styles.container}
    imageStyle={{ opacity: 0.7 }}
    resizeMode="cover"
  >
    <SafeAreaView />
    <Header page="3" />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.detailContainer}>
        <Progress progress="75" />
        <Text style={styles.title}>ระยะทางในการเดินทาง</Text>
        <View style={styles.optionGrid}>
          {distances.map((distance) => (
            <TouchableOpacity
              key={distance.distance_id}
              style={[
                styles.option,
                selectedDistance === distance.distance_id && styles.optionSelected,
              ]}
              onPress={() => setSelectedDistance(distance.distance_id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedDistance === distance.distance_id && styles.optionTextSelected,
                ]}
              >
                {distance.distance_km}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>งบประมาณในการเดินทาง</Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              setButget(numericValue);
            }}
            value={butget}
            keyboardType="numeric"
            style={styles.input}
            placeholder="กรอกงบประมาณ"
            
          />
          <Bank width={20} height={20} />
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
      style={[styles.arrowButton, !(selectedDistance && butget) && styles.buttonDisabled]}
      onPress={() => {
        if (selectedDistance && butget) {
          navigation.navigate("QA4", {
            selectedOption,
            selectedPlan,
            selectedDistance,
            butget,
          });
        }
      }}
      disabled={!(selectedDistance && butget)}
    >
      <Ionicons name="arrow-forward-circle" size={40} color={selectedDistance && butget ? "#5893d8" : "#999"} />
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
    fontFamily: FontFamily.KanitRegular,
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
    marginBottom: 10,
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 12,
    borderRadius: Border.br_base,
    alignItems: "center",
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
  buttonDisabled: {
    opacity: 0.5,
  },
});


export default QA3;
