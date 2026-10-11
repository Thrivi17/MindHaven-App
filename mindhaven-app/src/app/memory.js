import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const EMOJIS = ['🌸', '🌿', '☀️', '💧', '🪴', '🌻'];

export default function MemoryGameScreen() {
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    useEffect(() => { initializeGame(); }, []);

    const initializeGame = () => {
        const deck = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5).map((emoji, index) => ({ id: index, emoji }));
        setCards(deck); setFlipped([]); setMatched([]); setMoves(0); setGameComplete(false);
    };

    const handleCardPress = (index) => {
        if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
        Haptics.selectionAsync();
        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [firstIndex, secondIndex] = newFlipped;
            if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                const newMatched = [...matched, firstIndex, secondIndex];
                setMatched(newMatched);
                setFlipped([]);
                if (newMatched.length === cards.length) {
                    setGameComplete(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const handleClaimRewards = () => {
        router.push({
            pathname: '/',
            params: { rewardWater: 4, rewardSun: 4 }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Back to Garden</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Gratitude Memory Match</Text>
            <Text style={styles.subtitle}>Match pairs to focus your mind & earn rewards</Text>
            <Text style={styles.statsText}>Moves: {moves} | Matched: {matched.length / 2} / {EMOJIS.length}</Text>

            <View style={styles.grid}>
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || matched.includes(index);
                    return (
                        <TouchableOpacity key={index} style={[styles.card, isFlipped && styles.cardFlipped]} onPress={() => handleCardPress(index)}>
                            <Text style={styles.cardText}>{isFlipped ? card.emoji : '❓'}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {gameComplete && (
                <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>🎉 Sanctuary Restored!</Text>
                    <Text style={styles.completeSubtitle}>You earned +4 Water 💧 & +4 Sunlight ☀️!</Text>
                    <TouchableOpacity style={styles.rewardButton} onPress={handleClaimRewards}>
                        <Text style={styles.rewardButtonText}>Claim & Return 🎁</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', padding: 24, paddingTop: 50 },
    backButton: { alignSelf: 'flex-start', marginBottom: 16 },
    backButtonText: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#FACC15', marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 16, textAlign: 'center' },
    statsText: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 320, gap: 12 },
    card: { width: 65, height: 65, backgroundColor: '#1E293B', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
    cardFlipped: { backgroundColor: '#334155', borderColor: '#FACC15' },
    cardText: { fontSize: 28 },
    completeContainer: { marginTop: 24, alignItems: 'center' },
    completeTitle: { fontSize: 20, fontWeight: 'bold', color: '#4ADE80', marginBottom: 4 },
    completeSubtitle: { fontSize: 14, color: '#F8FAFC', marginBottom: 12 },
    rewardButton: { backgroundColor: '#FACC15', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    rewardButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 }
});