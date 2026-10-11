import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function BreathingScreen() {
    const router = useRouter();
    const [phase, setPhase] = useState('Breathe In');
    const [secondsLeft, setSecondsLeft] = useState(10);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        let timer;
        if (secondsLeft > 0 && !completed) {
            timer = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
                setPhase(prev => (prev === 'Breathe In' ? 'Breathe Out' : 'Breathe In'));
            }, 2000);
        } else if (secondsLeft === 0 && !completed) {
            setCompleted(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return () => clearInterval(timer);
    }, [secondsLeft, completed]);

    const handleFinish = () => {
        router.push({
            pathname: '/',
            params: { rewardWater: 3, rewardSun: 3 }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Back to Garden</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Mindful Breathing</Text>
            <Text style={styles.subtitle}>Center your breath to earn resources</Text>

            <View style={styles.circle}>
                <Text style={styles.phaseText}>{completed ? '✨ Complete!' : phase}</Text>
                <Text style={styles.timerText}>{secondsLeft}s</Text>
            </View>

            {completed && (
                <TouchableOpacity style={styles.rewardButton} onPress={handleFinish}>
                    <Text style={styles.rewardButtonText}>Claim +3 💧 & +3 ☀️ & Return</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', padding: 24 },
    backButton: { position: 'absolute', top: 50, left: 24 },
    backButtonText: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#4ADE80', marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 40 },
    circle: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4ADE80', marginBottom: 40 },
    phaseText: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    timerText: { color: '#38BDF8', fontSize: 16 },
    rewardButton: { backgroundColor: '#4ADE80', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 10 },
    rewardButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 }
});