import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.title}>Terms & Conditions 📜</Text>
                <Text style={styles.subtitle}>Last updated: October 2026</Text>

                <Text style={styles.body}>
                    Welcome to MindHaven. By registering and using our app, you agree to cultivate a peaceful mindset and respect our community guidelines.
                </Text>

                <Text style={styles.heading}>1. Free-to-Use Sanctuary</Text>
                <Text style={styles.body}>
                    MindHaven is completely free to use. Our core mission is to provide an immersive, stress-relief ecosystem where you can breathe, relax, and grow without paywalls or hidden fees.
                </Text>

                <Text style={styles.heading}>2. Mental Wellness & Disclaimer</Text>
                <Text style={styles.body}>
                    MindHaven is designed for relaxation, habit tracking, and mindfulness minigames. It is not a substitute for professional medical advice, therapy, or clinical treatment.
                </Text>

                <Text style={styles.heading}>3. Data & Privacy</Text>
                <Text style={styles.body}>
                    Your personal details (Name, Email, DOB) are kept secure for your account authentication and progress tracking. We never sell or share your personal data.
                </Text>

                <TouchableOpacity style={styles.agreeButton} onPress={() => router.back()}>
                    <Text style={styles.agreeButtonText}>I Understand & Agree</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F172A', alignItems: 'center', padding: 24, paddingTop: 50 },
    backButton: { alignSelf: 'flex-start', marginBottom: 16 },
    backButtonText: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold' },
    card: { width: '100%', maxWidth: 360, backgroundColor: '#1E293B', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#4ADE80', marginBottom: 4, textAlign: 'center' },
    subtitle: { fontSize: 11, color: '#94A3B8', marginBottom: 20, textAlign: 'center' },
    heading: { fontSize: 14, fontWeight: 'bold', color: '#38BDF8', marginTop: 14, marginBottom: 4 },
    body: { fontSize: 13, color: '#F8FAFC', lineHeight: 20 },
    agreeButton: { backgroundColor: '#4ADE80', marginTop: 24, padding: 14, borderRadius: 8, alignItems: 'center' },
    agreeButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 }
});