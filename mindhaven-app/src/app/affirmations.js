import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const DEFAULT_AFFIRMATIONS = [
    "I am resilient, and I grow stronger through every challenge.",
    "My peace of mind is more important than perfection.",
    "I give myself permission to rest and reset.",
    "Every step I take in my sanctuary brings me inner calm."
];

export default function AffirmationsScreen() {
    const router = useRouter();
    const [customAffirmation, setCustomAffirmation] = useState('');
    const [lanterns, setLanterns] = useState(DEFAULT_AFFIRMATIONS);

    const handleAddLantern = () => {
        if (!customAffirmation.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Empty Input', 'Please type a positive affirmation.');
            return;
        }

        setLanterns([customAffirmation.trim(), ...lanterns]);
        setCustomAffirmation('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('🌟 Lantern Lit!', 'Your positive affirmation is now glowing in your sanctuary.');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.push({ pathname: '/', params: { rewardWater: 3, rewardSun: 3 } })}>
                <Text style={styles.backButtonText}>← Claim +3 💧 & +3 ☀️ & Return</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.title}>Starlight Lanterns 🏮</Text>
                <Text style={styles.subtitle}>Light up positive affirmations around your sanctuary to combat negative self-talk.</Text>

                <TextInput 
                    style={styles.input}
                    placeholder="Write a personal affirmation..."
                    placeholderTextColor="#64748B"
                    value={customAffirmation}
                    onChangeText={setCustomAffirmation}
                />
                <TouchableOpacity style={styles.button} onPress={handleAddLantern}>
                    <Text style={styles.buttonText}>Light New Lantern ✨</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.listHeader}>Your Glowing Constellation 🌟</Text>
                {lanterns.map((item, index) => (
                    <View key={index} style={styles.lanternCard}>
                        <Text style={styles.lanternEmoji}>🏮</Text>
                        <Text style={styles.lanternText}>"{item}"</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F172A', alignItems: 'center', padding: 20, paddingTop: 40 },
    backButton: { alignSelf: 'flex-start', marginBottom: 16 },
    backButtonText: { color: '#38BDF8', fontSize: 13, fontWeight: 'bold' },
    card: { width: '100%', maxWidth: 380, backgroundColor: '#1E293B', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#FACC15', marginBottom: 4, textAlign: 'center' },
    subtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 16, lineHeight: 18 },
    input: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#334155', fontSize: 13 },
    button: { backgroundColor: '#FACC15', padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 13 },
    listContainer: { width: '100%', maxWidth: 380, gap: 10 },
    listHeader: { color: '#4ADE80', fontSize: 15, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
    lanternCard: { backgroundColor: '#1E293B', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#334155', gap: 12 },
    lanternEmoji: { fontSize: 24 },
    lanternText: { color: '#F8FAFC', fontSize: 13, flex: 1, fontStyle: 'italic', lineHeight: 18 }
});