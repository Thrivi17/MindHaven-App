import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, View, Text, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [isMobileDevice, setIsMobileDevice] = useState(true);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const checkMobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(userAgent.toLowerCase());
            setIsMobileDevice(checkMobile);
        }
    }, []);

    if (Platform.OS === 'web' && !isMobileDevice) {
        return (
            <View style={styles.blockContainer}>
                <Text style={styles.blockEmoji}>📱</Text>
                <Text style={styles.blockTitle}>Mobile Experience Only</Text>
                <Text style={styles.blockText}>
                    MindHaven is designed exclusively for mobile devices. Please open this link on your smartphone or tablet!
                </Text>
            </View>
        );
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    blockContainer: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 24 },
    blockEmoji: { fontSize: 48, marginBottom: 16 },
    blockTitle: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 12, textAlign: 'center' },
    blockText: { fontSize: 15, color: '#94A3B8', textAlign: 'center', maxWidth: 400, lineHeight: 22 }
});