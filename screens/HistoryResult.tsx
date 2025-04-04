import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Linking,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import MapIcon from "../assets/map.svg";
import { BASE_URL } from "../config";

type QAResult = {
  results_id: number;
  event_name: string;
  event_description: string;
  open_day: string;
  results_location: string;
  time_schedule: string;
  results_img_url: string;
  distance: string;
  created_at: string;
};

const HistoryResult = () => {
  type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProps>();
  const [qaResults, setQaResults] = useState<QAResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/qa_results`)
      .then((res) => res.json())
      .then((data) => {
        setQaResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching QA Results:", error);
        setLoading(false);
      });
  }, []);

  const openGoogleMaps = (name?: string) => {
    if (name) {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          name
        )}`
      );
    } else {
      alert("ไม่พบข้อมูลพิกัดของสถานที่นี้");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg_qa_1.jpg")}
      style={styles.container}
    >
      <SafeAreaView />
      <View style={styles.header}>
        <Text style={styles.title}>ประวัติสถานที่ท่องเที่ยว</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          qaResults
          
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map((place) => (
            <View key={place.results_id} style={styles.card}>
              <Image
                source={{ uri: place.results_img_url }}
                style={styles.image}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.placeName}>{place.event_name}</Text>
                <Text style={styles.description}>{place.event_description}</Text>
                <Text style={styles.description}>⏰เปิด: {place.open_day}</Text>
                <Text style={styles.description}>⏰เวลา: {place.time_schedule}</Text>
                <View style={styles.details}>
                  <MapIcon style={{ marginTop: 4 }} width={14} height={14} />
                  <Text style={styles.description}>
                  {place.results_location}
                  </Text>
                </View>
                <Text style={styles.description}>🚶{place.distance}</Text>

                <TouchableOpacity
                  style={styles.routeButton}
                  onPress={() => openGoogleMaps(place.event_name)}
                >
                  <Text style={styles.routeText}>ค้นหาเส้นทาง</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          onPress={async () => {
            const token = await AsyncStorage.getItem("userToken");
            if (token) {
              navigation.navigate("HomePage");
            } else {
              navigation.navigate("Auth");
            }
          }}
          style={[styles.routeButton, styles.back]}
        >
          <Text style={styles.routeText}>กลับหน้าแรก</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    borderBottomWidth: 0,
    borderBottomColor: Color.colorWhitesmoke_300,
  },
  title: {
    fontSize: 30,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  resultBox: {
    width: "100%",
    padding: 20,
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: Border.br_xl,
    marginBottom: 24,
    elevation: 5,
    shadowColor: "#000",
  },
  resultText: {
    color: "#828282",
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
  },
  card: {
    backgroundColor: Color.colorWhitesmoke_200,
    borderRadius: Border.br_base,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
  },
  image: {
    width: Dimensions.get("screen").width,
    height: 200,
  },
  infoContainer: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: 8,
    flex: 1,
    gap: 5,
  },
  placeName: {
    fontSize: 25,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorBlack,
  },
  description: {
    fontSize: 17,
    fontFamily: FontFamily.KanitRegular,
  },
  details: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  routeButton: {
    backgroundColor: Color.colorCornflowerblue,
    paddingVertical: 10,
    borderRadius: Border.br_base,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    marginTop: 10,
  },
  routeText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
  },
  back: {
    width: "30%",
    backgroundColor: "#B7B7B7",
    marginBottom: 40,
  },
});

export default HistoryResult;
