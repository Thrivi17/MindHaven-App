import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function GratitudeScreen() {
    const router = useRouter();
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('');
    const [item3, setItem3] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!item1.trim() || !item2.trim() || !item3.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Incomplete', 'Please fill in all 3 micro-moments of gratitude.');
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSubmitted(true);
    };

    const handleClaim = () => {
        router.push({
            pathname: '/',
            params: { rewardWater: 5, rewardSun: 5 }
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Back to Garden</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.title}>Three Good Things 🌻</Text>
                <Text style={styles.subtitle}>Rewire your brain toward gratitude by noting 3 small, positive moments from your day.</Text>

                {!submitted ? (
                    <>
                        <TextInput 
                            style={styles.input}
                            placeholder="1. (e.g., Warm morning coffee)"
                            placeholderTextColor="#64748B"
                            value={item1}
                            onChangeText={setItem1}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder="2. (e.g., A helpful message from a friend)"
                            placeholderTextColor="#64748B"
                            value={item2}
                            onChangeText={setItem2}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder="3. (e.g., Clear evening sky)"
                            placeholderTextColor="#64748B"
                            value={item3}
                            onChangeText={setItem3}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Save Reflection ✨</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <Text style={styles.successEmoji}>🌻✨</Text>
                        <Text style={styles.successTitle}>Gratitude Logged!</Text>
                        <Text style={styles.successDesc}>You have unlocked +5 Water 💧 and +5 Sunlight ☀️ for your ecosystem.</Text>
                        <TouchableOpacity style={styles.rewardButton} onPress={handleClaim}>
                            <Text style={styles.rewardButtonText}>Claim Rewards & Return 🎁</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F172A', alignItems: 'center', padding: 20, paddingTop: 40 },
    backButton: { alignSelf: 'flex-start', marginBottom: 16 },
    backButtonText: { color: '#38BDF8', fontSize: 13, fontWeight: 'bold' },
    card: { width: '100%', maxWidth: 380, backgroundColor: '#1E293B', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#4ADE80', marginBottom: 4, textAlign: 'center' },
    subtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
    input: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155', fontSize: 13 },
    button: { backgroundColor: '#4ADE80', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 6 },
    buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
    successContainer: { alignItems: 'center', paddingVertical: 10 },
    successEmoji: { fontSize: 42, marginBottom: 8 },
    successTitle: { color: '#4ADE80', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    successDesc: { color: '#F8FAFC', fontSize: 13, textAlign: 'center', marginBottom: 20 },
    rewardButton: { backgroundColor: '#38BDF8', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
    rewardButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 }
});