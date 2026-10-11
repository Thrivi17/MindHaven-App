import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginUser, registerUser } from '../services/api';

export default function LoginScreen() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        // Client-side password validation check for registration
        if (isRegistering) {
            if (password.length < 6 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                Alert.alert(
                    'Weak Password',
                    'Password must be at least 6 characters long and include 1 uppercase letter, 1 number, and 1 special character.'
                );
                return;
            }
        }

        setLoading(true);
        try {
            if (isRegistering) {
                const data = await registerUser(email, password);
                if (data.status === 'success') {
                    Alert.alert(
                        'Success! 🎉',
                        'Account created successfully. Please log in with your new credentials.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    setIsRegistering(false); // Switch back to login view
                                    setPassword(''); // Clear password for security
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert('Notice', data.message);
                }
            } else {
                const data = await loginUser(email, password);
                if (data.status === 'success') {
                    // Navigate to your main garden/chat screen upon successful login
                    router.replace('/chat');
                } else {
                    Alert.alert('Notice', data.message);
                }
            }
        } catch (error) {
            Alert.alert('Connection Error', 'Unable to reach backend authentication service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MindHaven 🌿</Text>
            <Text style={styles.subtitle}>{isRegistering ? 'Create your account' : 'Welcome back'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password (min 6 chars, 1 caps, 1 num, 1 special)"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Processing...' : (isRegistering ? 'Register 🚀' : 'Login 🚀')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                <Text style={styles.switchText}>
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#4ADE80', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 24 },
    input: { backgroundColor: '#1E293B', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
    button: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
    switchText: { color: '#38BDF8', textAlign: 'center', marginTop: 20, fontSize: 14 }
});