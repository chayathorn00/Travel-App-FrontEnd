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
  const [emotions, setEmotions] = useState<{ id: string; label: string }[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  
  const getEmoji = (label: string) => {
    switch (label) {
      case "รู้สึกมีความรัก":
        return "❤️";
      case "รู้สึกมีความสุข":
        return "😊";
      case "รู้สึกสบายๆ":
        return "😌";
      case "รู้สึกเศร้า":
        return "😢";
      case "รู้สึกเหนื่อยล้า":
        return "😩";
      case "รู้สึกหิว":
        return "😋";
      case "รู้สึกเซ็ง":
        return "😑";
      case "รู้สึกโกรธ":
        return "😠";
      case "รู้สึกเบื่อ":
        return "🥱";
      case "รู้สึกเพิ่งเสร็จงาน":
        return "🏁";
      default:
        return "❓";
    }
  };
  
  
  useEffect(() => {
    fetch(`${BASE_URL}/qa_activity`)
      .then((response) => response.json())
      .then((data) => {
        const formattedActivities = data.map((item: any) => ({
          id: item.activity_id.toString(), // ใช้ `picture_id` เป็น `id`
          label: item.activity_name, // ใช้ `theme` เป็น `label`
        }));
        //formattedActivities.push({ id: "custom", label: "+ กำหนดกิจกรรมเอง" });
        setActivities(formattedActivities);
      })
      .catch((error) => console.error("Error fetching activities:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/qa_emotional`)
      .then((response) => response.json())
      .then((data) => {
        const formatted = data.map((item: any) => ({
          id: item.emotional_id.toString(),
          label: item.emotional_name,
        }));
        setEmotions(formatted);
      })
      .catch((error) => console.error("Error fetching emotions:", error));
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
          selectedActivities.length >= 3 && selectedEmotion
            ? () => {
                navigation.navigate("Loading", {
                  selectedOption,
                  selectedPlan,
                  selectedDistance,
                  butget,
                  selectedActivities,
                  selectedEmotion, // <<<< ส่งไปด้วย
                });
              }
            : undefined
        }
        
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Progress progress="100" />
        <Text style={styles.title}>กิจกรรมที่คุณสนใจ</Text>
        <Text style={styles.subtitle}>(เลือกอย่างต่ำ 3 ข้อ)</Text>
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
                {selectedActivities.includes(activity.id)}
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
        <Text style={styles.title}>ตอนนี้คุณรู้สึกแบบไหน?</Text>
        <View style={styles.optionGrid}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.id}
              style={[
                styles.option2,
                selectedEmotion === emotion.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedEmotion(emotion.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedEmotion === emotion.id && styles.optionTextSelected,
                ]}
              >
                {getEmoji(emotion.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        

      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  subtitle:{
    fontSize: 20,
    fontFamily: FontFamily.KanitLight,
    color: Color.colorBlack,
    marginBottom: 0,
    textAlign: "center",
  },
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
    marginBottom: 0,
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
  option2: {
    width: "10%",
    backgroundColor: Color.colorWhitesmoke_100,
    paddingVertical: 10,
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
