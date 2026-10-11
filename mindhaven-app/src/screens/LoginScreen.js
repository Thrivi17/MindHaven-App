import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginUser, registerUser } from '../services/api';

export default function LoginScreen() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        // Client-side password validation check for registration
        if (isRegistering) {
            if (trimmedPassword.length < 6 || !/[A-Z]/.test(trimmedPassword) || !/\d/.test(trimmedPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(trimmedPassword)) {
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
                const data = await registerUser(trimmedEmail, trimmedPassword);
                if (data && data.status === 'success') {
                    Alert.alert(
                        'Success! 🌱',
                        data.message || 'Account created successfully. Please log in.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    setIsRegistering(false); // Switch back to login view
                                    setPassword(''); // Clear password field
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert('Registration Notice', data?.message || 'Could not register account.');
                }
            } else {
                const data = await loginUser(trimmedEmail, trimmedPassword);
                if (data && data.status === 'success') {
                    // Navigate to your main garden/chat screen upon successful login
                    router.replace('/chat');
                } else {
                    Alert.alert('Login Notice', data?.message || 'Invalid credentials.');
                }
            }
        } catch (error) {
            console.error('Auth submission error:', error);
            Alert.alert('Connection Error', 'Unable to reach backend authentication service. Check if your Render backend is awake.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>MindHaven 🌿</Text>
                <Text style={styles.subtitle}>
                    {isRegistering ? 'Create your account to start growing' : 'Welcome back, please sign in'}
                </Text>

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
                    placeholder={isRegistering ? "Password (min 6 chars, 1 caps, 1 num, 1 special)" : "Password"}
                    placeholderTextColor="#64748B"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleSubmit} 
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Processing...' : (isRegistering ? 'Register 🚀' : 'Sign In 🚀')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => {
                        setIsRegistering(!isRegistering);
                        setPassword(''); // Reset password field on switch
                    }}
                >
                    <Text style={styles.switchText}>
                        {isRegistering ? 'Already have an account? Login here' : "Don't have an account? Register here"}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    formContainer: { flex: 1, justifyContent: 'center', padding: 24, maxWidth: 400, width: '100%', alignSelf: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#4ADE80', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 15, color: '#94A3B8', textAlign: 'center', marginBottom: 28 },
    input: { backgroundColor: '#1E293B', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#334155', fontSize: 16 },
    button: { backgroundColor: '#38BDF8', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
    switchText: { color: '#38BDF8', textAlign: 'center', marginTop: 24, fontSize: 14 }
});
