import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function WorryStreamScreen() {
    const router = useRouter();
    const [thought, setThought] = useState('');
    const [released, setReleased] = useState(false);

    const handleRelease = () => {
        if (!thought.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Empty Thought', 'Please type the worry or stress you wish to release.');
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setReleased(true);
    };

    const handleReset = () => {
        setThought('');
        setReleased(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.push({ pathname: '/', params: { rewardWater: 2, rewardSun: 2 } })}>
                <Text style={styles.backButtonText}>← Claim +2 💧 & +2 ☀️ & Return</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.title}>The Worry Release Stream 🌊</Text>
                <Text style={styles.subtitle}>
                    Type a heavy thought or anxiety you are carrying. When you release it, watch it drift downstream away from your mind.
                </Text>

                {!released ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="What is weighing on your mind right now?"
                            placeholderTextColor="#64748B"
                            multiline={true}
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={thought}
                            onChangeText={setThought}
                        />
                        <TouchableOpacity style={styles.releaseButton} onPress={handleRelease}>
                            <Text style={styles.releaseButtonText}>Release Down the Stream 🍃</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.releasedContainer}>
                        <Text style={styles.rippleEmoji}>🌊 🍃 ✨</Text>
                        <Text style={styles.releasedTitle}>Thought Released Successfully</Text>
                        <Text style={styles.releasedDesc}>
                            Your thought has drifted downstream. You have safely separated yourself from the worry. Take a deep breath.
                        </Text>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>Release Another Thought</Text>
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
    card: { width: '100%', maxWidth: 380, backgroundColor: '#1E293B', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#38BDF8', marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
    input: { width: '100%', backgroundColor: '#0F172A', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#334155', fontSize: 14, minHeight: 120 },
    releaseButton: { width: '100%', backgroundColor: '#4ADE80', padding: 14, borderRadius: 8, alignItems: 'center' },
    releaseButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
    releasedContainer: { alignItems: 'center', paddingVertical: 20 },
    rippleEmoji: { fontSize: 48, marginBottom: 12 },
    releasedTitle: { color: '#4ADE80', fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    releasedDesc: { color: '#F8FAFC', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
    resetButton: { backgroundColor: '#38BDF8', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    resetButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 13 }
});