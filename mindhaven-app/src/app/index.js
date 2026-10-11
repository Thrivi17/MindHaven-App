import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { loginUser, registerUser } from '../services/api'; // Import your backend service layer

export default function AuthGateScreen() {
    const router = useRouter();
    const [isLoginView, setIsLoginView] = useState(true);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [loading, setLoading] = useState(false);

    // Password validation helper
    const validatePassword = (pass) => {
        if (pass.length < 6) return "Password must be at least 6 characters long.";
        if (!/[A-Z]/.test(pass)) return "Password must contain at least 1 uppercase letter.";
        if (!/\d/.test(pass)) return "Password must contain at least 1 number.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least 1 special character.";
        return null;
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Access Denied', 'Please enter your email and password.');
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(email, password);

            if (data.status === 'success') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                // Navigate to Garden screen with initial stats
                router.push({
                    pathname: '/garden',
                    params: {
                        userId: data.user_id,
                        waterDrops: 10,
                        sunlight: 5,
                        stageIndex: 0,
                        streak: 1
                    }
                });
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                // If account does not exist or password incorrect, alert user
                Alert.alert('Authentication Failed', data.message);
            }
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Connection Error', 'Unable to reach backend server. Make sure FastAPI is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !dob.trim() || !password.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Missing Fields', 'Please fill in all registration details.');
            return;
        }

        // Validate password policy
        const passwordError = validatePassword(password);
        if (passwordError) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Weak Password', passwordError);
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser(email, password);

            if (data.status === 'success') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                    '✨ Registration Successful!',
                    'Your sanctuary account has been created. Please log in.',
                    [{ text: 'Log In Now', onPress: () => setIsLoginView(true) }]
                );
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert('Registration Failed', data.message);
            }
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Connection Error', 'Unable to reach backend server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.logo}>🌿 MindHaven</Text>
                <Text style={styles.title}>
                    {isLoginView ? 'Welcome Back' : 'Create Your Sanctuary'}
                </Text>
                <Text style={styles.description}>
                    MindHaven is a 100% free-to-use immersive wellness app designed to help you recover from daily stress, unwind, and cultivate mental peace.
                </Text>

                {!isLoginView && (
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#64748B"
                        value={name}
                        onChangeText={setName}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#64748B"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                {!isLoginView && (
                    <TextInput
                        style={styles.input}
                        placeholder="Date of Birth (DD/MM/YYYY)"
                        placeholderTextColor="#64748B"
                        value={dob}
                        onChangeText={setDob}
                    />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Password (min 6 chars, 1 caps, 1 num, 1 special)"
                    placeholderTextColor="#64748B"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {isLoginView ? (
                    <>
                        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? 'Checking...' : 'Log In & Enter Sanctuary 🌲'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkButton} onPress={() => setIsLoginView(false)}>
                            <Text style={styles.linkButtonText}>New user? Register here ✨</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register Account ✨'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkButton} onPress={() => setIsLoginView(true)}>
                            <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity style={styles.termsLink} onPress={() => router.push('/terms')}>
                    <Text style={styles.termsText}>View Terms & Conditions 📜</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: { width: '100%', maxWidth: 360, backgroundColor: '#1E293B', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
    logo: { fontSize: 26, fontWeight: 'bold', color: '#4ADE80', textAlign: 'center', marginBottom: 6 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', textAlign: 'center', marginBottom: 8 },
    description: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
    input: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155', fontSize: 14 },
    button: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12, marginTop: 4 },
    buttonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 15 },
    linkButton: { alignItems: 'center', padding: 6, marginBottom: 4 },
    linkButtonText: { color: '#4ADE80', fontSize: 13, fontWeight: '600' },
    termsLink: { alignItems: 'center', padding: 4 },
    termsText: { color: '#94A3B8', fontSize: 11 }
});