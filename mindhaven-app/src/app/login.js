import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Simple mock verification (any non-empty input or specific mock check)
        if (!email || !password) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Access Denied', 'Please enter valid login credentials.');
            return;
        }

        // Verification check (for demonstration, checks if email has @)
        if (!email.includes('@')) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Access Denied', 'Invalid credentials. Access restricted.');
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Pass starting stats to the Garden screen upon successful login
        router.push({
            pathname: '/',
            params: {
                waterDrops: 10,
                sunlight: 5,
                stageIndex: 0,
                streak: 1
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.logo}>🌿 MindHaven</Text>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Log in to enter your sanctuary</Text>

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
                    placeholder="Password"
                    placeholderTextColor="#64748B"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Enter Sanctuary 🌲</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/register')}>
                    <Text style={styles.linkButtonText}>New user? Register here</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { width: '100%', maxWidth: 360, backgroundColor: '#1E293B', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
    logo: { fontSize: 24, fontWeight: 'bold', color: '#4ADE80', textAlign: 'center', marginBottom: 4 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'center', marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: 24 },
    input: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155', fontSize: 14 },
    button: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12, marginTop: 4 },
    buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
    linkButton: { alignItems: 'center', padding: 6 },
    linkButtonText: { color: '#94A3B8', fontSize: 13 }
});