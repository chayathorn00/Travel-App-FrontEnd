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

const QA4 = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "QA4">>();
  const route = useRoute<RouteProp<RootStackParamList, "QA4">>();
  const { selectedOption, selectedPlan, selectedDistance, butget } =
    route.params;

  const [activities, setActivities] = useState<{ id: string; label: string }[]>(
    []
  );
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
        //formattedActivities.push({ id: "custom", label: "+ กำหนดกิจกรรมเอง" });
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
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView />
      <Header
        page="4"
        previous={() => {
          navigation.goBack();
        }}
        next={
          selectedActivities.length >= 1
            ? () => {
                navigation.navigate("Loading", {
                  selectedOption,
                  selectedPlan,
                  selectedDistance,
                  butget,
                  selectedActivities,
                });
              }
            : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Progress progress="100" />
        <Text style={styles.title}>กิจกรรมที่คุณสนใจ</Text>

        {loading ? (
          <ActivityIndicator size="large" color={Color.colorCornflowerblue} />
        ) : (
          <View style={styles.optionGrid}>
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.option,
                  selectedActivities.includes(activity.id) &&
                    styles.optionSelected,
                ]}
                onPress={() => toggleActivity(activity.id)}
              >
                {selectedActivities.includes(activity.id) && (
                  <Check width={16} height={16} />
                )}
                <Text
                  style={[
                    styles.optionText,
                    selectedActivities.includes(activity.id) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedActivities.includes("custom") && (
          <TextInput
            style={styles.input}
            placeholder="ระบุกิจกรรมของคุณ"
            placeholderTextColor={Color.colorGray_200}
            value={customActivity}
            onChangeText={(text) => setCustomActivity(text)}
            keyboardType="default"
            autoCapitalize="none"
          />
        )}
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
    paddingBottom: 100,
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
  },
  option: {
    width: "40%",
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 15,
    borderRadius: Border.br_base,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    marginHorizontal: 15,
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  optionSelected: {
    borderColor: Color.colorCornflowerblue,
    backgroundColor: Color.colorCornflowerblue,
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
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Color.colorGray_200,
    borderRadius: Border.br_base,
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
    backgroundColor: Color.colorWhite,
    marginHorizontal: 20,
  },
  doneButton: {
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
  buttonDisabled: {
    backgroundColor: Color.colorGray_100,
  },
  buttonText: {
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.KanitRegular,
    fontWeight: "700",
    color: Color.colorWhite,
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
});

export default QA4;
