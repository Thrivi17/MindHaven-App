import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function DefenseGameScreen() {
    const router = useRouter();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isPlaying, setIsPlaying] = useState(false);
    const [intruder, setIntruder] = useState(null);

    const intruderTypes = [
        { type: 'weed', emoji: '🌿', name: 'Weed', points: 1 },
        { type: 'caterpillar', emoji: '🐛', name: 'Caterpillar', points: 2 },
        { type: 'ladybug', emoji: '🐞', name: 'Lucky Ladybug', points: 3 }
    ];

    useEffect(() => {
        let timer;
        let spawnInterval;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            spawnInterval = setInterval(() => {
                const randomIntruder = intruderTypes[Math.floor(Math.random() * intruderTypes.length)];
                setIntruder({
                    id: Date.now(),
                    ...randomIntruder,
                    left: `${Math.floor(Math.random() * 65) + 10}%`,
                    top: `${Math.floor(Math.random() * 65) + 10}%`,
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
            setIntruder(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return () => { clearInterval(timer); clearInterval(spawnInterval); };
    }, [isPlaying, timeLeft]);

    const handleStartGame = () => { setScore(0); setTimeLeft(15); setIsPlaying(true); Haptics.selectionAsync(); };
    const handleTapIntruder = (points) => { setScore(prev => prev + points); setIntruder(null); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); };

    const handleClaimRewards = () => {
        router.push({
            pathname: '/',
            params: { rewardWater: score, rewardSun: score }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Back to Garden</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Sanctuary Defense</Text>
            <Text style={styles.subtitle}>Clear weeds & protect your plant from critters!</Text>

            <View style={styles.statsRow}>
                <Text style={styles.statsText}>Score: {score} 🌿</Text>
                <Text style={styles.statsText}>Time: {timeLeft}s</Text>
            </View>

            <View style={styles.gameArea}>
                {!isPlaying && timeLeft === 15 && (
                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <Text style={styles.startButtonText}>Start 15s Defense 🐛</Text>
                    </TouchableOpacity>
                )}

                {!isPlaying && timeLeft === 0 && (
                    <View style={styles.gameOverContainer}>
                        <Text style={styles.gameOverTitle}>✨ Garden Cleared!</Text>
                        <Text style={styles.gameOverSubtitle}>Earned +{score} Water 💧 & Sunlight ☀️!</Text>
                        <TouchableOpacity style={styles.startButton} onPress={handleClaimRewards}>
                            <Text style={styles.startButtonText}>Claim & Return 🎁</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isPlaying && intruder && (
                    <TouchableOpacity key={intruder.id} activeOpacity={0.7} style={[styles.intruderBox, { left: intruder.left, top: intruder.top }]} onPress={() => handleTapIntruder(intruder.points)}>
                        <Text style={styles.intruderEmoji}>{intruder.emoji}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', padding: 24, paddingTop: 50 },
    backButton: { alignSelf: 'flex-start', marginBottom: 16 },
    backButtonText: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#4ADE80', marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 20, textAlign: 'center' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 320, marginBottom: 16, paddingHorizontal: 10 },
    statsText: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
    gameArea: { width: 320, height: 320, backgroundColor: '#1E293B', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155', position: 'relative', overflow: 'hidden' },
    startButton: { backgroundColor: '#4ADE80', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10 },
    startButtonText: { color: '#0F172A', fontSize: 15, fontWeight: 'bold' },
    gameOverContainer: { alignItems: 'center', padding: 20 },
    gameOverTitle: { fontSize: 20, fontWeight: 'bold', color: '#4ADE80', marginBottom: 4 },
    gameOverSubtitle: { fontSize: 13, color: '#F8FAFC', marginBottom: 16, textAlign: 'center' },
    intruderBox: { position: 'absolute', width: 54, height: 54, justifyContent: 'center', alignItems: 'center', backgroundColor: '#334155', borderRadius: 27, borderWidth: 2, borderColor: '#4ADE80', zIndex: 10 },
    intruderEmoji: { fontSize: 28 }
});