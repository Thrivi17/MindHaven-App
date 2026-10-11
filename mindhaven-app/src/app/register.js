import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');

    const handleRegister = () => {
        if (!name || !email || !dob) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Missing Fields', 'Please fill in all registration details.');
            return;
        }

        // Save mock user details locally or pass them to login
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('✨ Registration Successful!', 'Welcome to your sanctuary. Please log in with your credentials.', [
            { text: 'Proceed to Login', onPress: () => router.push('/login') }
        ]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.logo}>🌿 MindHaven</Text>
                <Text style={styles.title}>Create Your Sanctuary</Text>
                <Text style={styles.description}>
                    MindHaven is a 100% free-to-use immersive wellness app designed to help you recover from daily stress, unwind, and cultivate mental peace through mindful gameplay and storytelling.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#64748B"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#64748B"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Date of Birth (DD/MM/YYYY)"
                    placeholderTextColor="#64748B"
                    value={dob}
                    onChangeText={setDob}
                />

                <TouchableOpacity onPress={() => router.push('/terms')} style={styles.termsLink}>
                    <Text style={styles.termsText}>View Terms & Conditions 📜</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register Account ✨</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/login')}>
                    <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { width: '100%', maxWidth: 360, backgroundColor: '#1E293B', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
    logo: { fontSize: 24, fontWeight: 'bold', color: '#4ADE80', textAlign: 'center', marginBottom: 4 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'center', marginBottom: 12 },
    description: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
    input: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155', fontSize: 14 },
    termsLink: { marginBottom: 16, alignItems: 'center' },
    termsText: { color: '#38BDF8', fontSize: 12, fontWeight: '600' },
    button: { backgroundColor: '#4ADE80', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
    linkButton: { alignItems: 'center', padding: 6 },
    linkButtonText: { color: '#94A3B8', fontSize: 13 }
});