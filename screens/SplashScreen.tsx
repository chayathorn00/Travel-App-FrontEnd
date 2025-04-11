import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import { StatusBar } from 'expo-status-bar';


type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('QA1'); // ไปยังหน้าแรก
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
          source={require("../assets/first.png")}
          style={styles.background}
          resizeMode="cover"
        >
          <StatusBar hidden />
          
          {/* Overlay */}
          <View style={styles.overlay} />
    
          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.appTitle}>NexTrip</Text>
          </View>
          <View style={styles.sectionPosition}>
            <Text style={styles.subtitle}>
              <Text style={styles.letThe}>ให้เรา{"\n"}</Text>
              <Text style={styles.feelingTakeYou}>จัดหาที่{"\n"}</Text>
              <Text style={styles.travel}>ท่องเที่ยว</Text>
            </Text>
          </View>
        </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionPosition: {
    position: "absolute",
    bottom: "20%",
    paddingHorizontal: 40,
    alignItems: "center", // 👈 เพิ่มบรรทัดนี้
    justifyContent: "center", // 👈 เพิ่มบรรทัดนี้
    width: "100%", // 👈 เพื่อให้ alignItems มีผล
  },
  background: {
    flex: 1, // ทำให้ background เต็มจอ
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // ดันเนื้อหาขึ้นด้านบน
    paddingHorizontal: 20,
    position: "absolute",
    top: "15%",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: FontFamily.KanitRegular,
  },
  subtitle: {
    fontSize: 24,
    color: '#eeeeee',
    marginTop: 10,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center", // 👈 เพิ่มบรรทัดนี้เพื่อความชัวร์

  },
  appTitle: {
    fontSize: 64,
    fontFamily: FontFamily.KanitRegular,
    color: Color.colorWhite,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 10,
    textAlign: "center",
  },
  letThe: {
    fontSize: 35,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 10,
  },
  feelingTakeYou: {
    fontSize: 40,
    fontFamily: FontFamily.KanitRegular,
    fontWeight: "500",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 10,
  },
  travel: {
    fontSize: 50,
    fontFamily: FontFamily.KanitRegular,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 10,
  },
});
