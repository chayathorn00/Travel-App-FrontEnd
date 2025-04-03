import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App"; 
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import Header from "../component/Header";
import Progress from "../component/Progress";
import Check from "../assets/check.svg";
import { BASE_URL } from "../config";
import Ionicons from "react-native-vector-icons/Ionicons";

const QA4 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "QA4">>();
  const route = useRoute<RouteProp<RootStackParamList, "QA4">>();
  const { selectedOption, selectedPlan, selectedDistance, butget } = route.params;

  const [activities, setActivities] = useState<{ id: string; label: string }[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/qa_activity`)
      .then((response) => response.json())
      .then((data) => {
        const formattedActivities = data.map((item: any) => ({
          id: item.picture_id.toString(), // ใช้ `picture_id` เป็น `id`
          label: item.theme, // ใช้ `theme` เป็น `label`
        }));
        formattedActivities.push({ id: "custom", label: "+ กำหนดกิจกรรมเอง" });
        setActivities(formattedActivities);
      })
      .catch((error) => console.error("Error fetching activities:", error))
      .finally(() => setLoading(false));
  }, []);

  const toggleActivity = (id: string) => {
    setSelectedActivities((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <View style={styles.wrapper}>
  <ImageBackground
    source={require("../assets/6fbc45fd-8842-4131-ac3c-b919eff34c6b.jpg")}
    style={styles.container}
    imageStyle={{ opacity: 0.7 }}
    resizeMode="cover"
  >
    <SafeAreaView />
    <Header page="4" />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.detailContainer}>
        <Progress progress="100" />
        <Text style={styles.title}>กิจกรรมหรือความสนใจ</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Color.colorCornflowerblue} />
        ) : (
          <View style={styles.optionGrid}>
            {activities
              .filter((activity) => activity.id !== "custom")
              .map((activity) => {
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => toggleActivity(activity.id)}
                  >
                    {isSelected && <Check width={16} height={16} />}
                    <Text
                      style={[styles.optionText, isSelected && styles.optionTextSelected]}
                    >
                      {activity.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.customOption,
            selectedActivities.includes("custom") && styles.optionSelected,
          ]}
          onPress={() => toggleActivity("custom")}
        >
          <Text
            style={[
              styles.optionText,
              selectedActivities.includes("custom") && styles.optionTextSelected,
            ]}
          >
            กำหนดกิจกรรมเอง
          </Text>
          {selectedActivities.includes("custom") && (
          <TextInput
            style={styles.input}
            placeholder="ระบุกิจกรรมของคุณ"
            placeholderTextColor={Color.colorGray_200}
            value={customActivity}
            onChangeText={setCustomActivity}
          />
        )}
        </TouchableOpacity>
      </View>
    </ScrollView>

    {/* ปุ่มย้อนกลับ */}
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back-circle" size={40} color="#5893d8" />
    </TouchableOpacity>

    {/* ปุ่มถัดไป */}
    <TouchableOpacity
      style={[
        styles.arrowButton,
        selectedActivities.length < 3 && styles.buttonDisabled,
      ]}
      onPress={() => {
        if (selectedActivities.length >= 3) {
          navigation.navigate("Loading", {
            selectedOption,
            selectedPlan,
            selectedDistance,
            butget,
            selectedActivities,
          });
        }
      }}
      disabled={selectedActivities.length < 3}
    >
      <Ionicons
        name="arrow-forward-circle"
        size={40}
        color={selectedActivities.length >= 3 ? "#5893d8" : "#999"}
      />
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
    marginBottom: 30,
    textAlign: "center",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  option: {
    width: "47%",
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 23,
    borderRadius: Border.br_base,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
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
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    marginLeft: 4,
  },
  optionTextSelected: {
    color: Color.colorWhite,
  },
  input: {
    marginTop: 1,
    padding: 20,
    borderWidth: 3,
    borderColor: Color.colorGray_200,
    borderRadius: Border.br_base,
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    backgroundColor: Color.colorWhite,
    marginHorizontal: 15,
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
  customOption: {
    width: "85%",
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 15,
    borderRadius: Border.br_base,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  
});


export default QA4;
