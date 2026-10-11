import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const storyNodes = {
    start: {
        chapter: 1,
        title: "The Awakening in the Silt",
        narrative: "You awaken in a quiet clearing inside the realm of Aethelgard. The ground is blanketed in the 'Silt'—a heavy fog born from fatigue and anxiety. In the center lies the dormant Heart Seed. Three distinct paths emerge through the mist.",
        choices: [
            { text: "🔥 Take the Path of the Hearth (Focus on inner emotional warmth)", next: 'hearth_1' },
            { text: "🌊 Take the Path of the Tides (Focus on emotional flow & reflection)", next: 'tides_1' },
            { text: "⚡ Take the Path of the Spark (Focus on active resilience & drive)", next: 'spark_1' }
        ]
    },
    hearth_1: {
        chapter: 2,
        title: "The Path of the Hearth: The Guardian's Ember",
        narrative: "You walk among ancient hearthstones. The Spirit of Self-Doubt blocks your way, whispering that your past mistakes define your worth.",
        choices: [
            { text: "Forgive yourself aloud, warming the air with self-compassion.", next: 'hearth_end' },
            { text: "Bake a memory of joy into an ember to melt the frost.", next: 'hearth_end' }
        ]
    },
    hearth_end: {
        chapter: 3,
        title: "Ending: The Sanctuary of the Eternal Hearth",
        narrative: "✨ **The Good Ending (The Inner Beacon)**: Your profound self-acceptance ignites a radiant sanctuary. A majestic Golden Oak blooms, teaching Aethelgard that self-love is armor against burnout.",
        choices: [{ text: "Claim +10 Water 💧 & +10 Sunlight ☀️ & Return", next: 'finish', reward: { water: 10, sun: 10 } }]
    },
    tides_1: {
        chapter: 2,
        title: "The Path of the Tides: The Mirror Lake",
        narrative: "You find yourself at the edge of a still lake reflecting a stormy sky. The Phantom of Overwhelm tries to pull you under.",
        choices: [
            { text: "Sit by the shore and let your tears flow like rain.", next: 'tides_end' },
            { text: "Breathe in with the rising tide, release with the wave.", next: 'tides_end' }
        ]
    },
    tides_end: {
        chapter: 3,
        title: "Ending: The Crystal Springs of Clarity",
        narrative: "✨ **The Good Ending (The Flowing Mind)**: Surrendering to emotional flow transforms the lake into crystal springs. The Heart Seed sprouts into a weeping willow of pure glass-like crystal.",
        choices: [{ text: "Claim +10 Water 💧 & +10 Sunlight ☀️ & Return", next: 'finish', reward: { water: 10, sun: 10 } }]
    },
    spark_1: {
        chapter: 2,
        title: "The Path of the Spark: The Obsidian Mount",
        narrative: "You scale a steep cliff representing rigid routines and pressure. The Shadow of Exhaustion urges you to give up.",
        choices: [
            { text: "Pause, rest your bones, and establish a firm boundary.", next: 'spark_end' },
            { text: "Channel your micro-habits into an ascending ladder of light.", next: 'spark_end' }
        ]
    },
    spark_end: {
        chapter: 3,
        title: "Ending: The Peak of the Aurora Monolith",
        narrative: "✨ **The Good Ending (The Resilient Peak)**: Your structured discipline forges a path through the storm. The Heart Seed erupts into a towering Aurora Monolith Tree.",
        choices: [{ text: "Claim +10 Water 💧 & +10 Sunlight ☀️ & Return", next: 'finish', reward: { water: 10, sun: 10 } }]
    }
};

export default function StoryGameScreen() {
    const router = useRouter();
    const [currentNodeKey, setCurrentNodeKey] = useState('start');
    const activeNode = storyNodes[currentNodeKey];

    const handleChoice = (nextNodeKey, reward) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (nextNodeKey === 'finish') {
            router.push({
                pathname: '/',
                params: { rewardWater: reward.water, rewardSun: reward.sun }
            });
        } else {
            setCurrentNodeKey(nextNodeKey);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Back to Garden</Text>
            </TouchableOpacity>
            <View style={styles.parchmentCard}>
                <Text style={styles.chapterTag}>Chapter {activeNode.chapter} • Chronicles of Aethelgard</Text>
                <Text style={styles.title}>{activeNode.title}</Text>
                <Text style={styles.narrative}>{activeNode.narrative}</Text>
                <View style={styles.choicesContainer}>
                    {activeNode.choices.map((choice, index) => (
                        <TouchableOpacity key={index} style={styles.choiceButton} onPress={() => handleChoice(choice.next, choice.reward || { water: 10, sun: 10 })}>
                            <Text style={styles.choiceButtonText}>{choice.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F172A', alignItems: 'center', padding: 24, paddingTop: 50 },
    backButton: { alignSelf: 'flex-start', marginBottom: 16 },
    backButtonText: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold' },
    parchmentCard: { width: '100%', maxWidth: 360, backgroundColor: '#1E293B', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
    chapterTag: { fontSize: 11, fontWeight: 'bold', color: '#38BDF8', textTransform: 'uppercase', marginBottom: 6 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#4ADE80', marginBottom: 14 },
    narrative: { fontSize: 14, color: '#F8FAFC', lineHeight: 22, marginBottom: 20 },
    choicesContainer: { gap: 12 },
    choiceButton: { backgroundColor: '#0F172A', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
    choiceButtonText: { color: '#FACC15', fontSize: 13, fontWeight: '600', textAlign: 'center' }
});