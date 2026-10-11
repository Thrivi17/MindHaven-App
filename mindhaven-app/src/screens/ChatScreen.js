import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { sendSecureChatMessage } from '../services/api';

export default function ChatScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState([
        { id: '1', sender: 'ai', text: 'Hello! I am your MindHaven AI guide. How are you feeling today? 🌿' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages((prev) => [...prev, userMsg]);
        const promptText = input;
        setInput('');
        setLoading(true);

        try {
            const data = await sendSecureChatMessage(1, promptText);
            const aiMsg = { id: (Date.now() + 1).toString(), sender: 'ai', text: data.response };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = { id: (Date.now() + 1).toString(), sender: 'ai', text: '⚠️ Unable to connect to guardrail service. Take a deep breath! 🌲' };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>← Back to Garden</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Wellness Guide 💬</Text>
            </View>

            {/* Chat Messages */}
            <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingVertical: 12, gap: 12 }}>
                {messages.map((item) => (
                    <View
                        key={item.id}
                        style={[
                            styles.bubble,
                            item.sender === 'user' ? styles.userBubble : styles.aiBubble,
                        ]}
                    >
                        <Text style={styles.bubbleText}>{item.text}</Text>
                    </View>
                ))}
                {loading && (
                    <View style={[styles.bubble, styles.aiBubble]}>
                        <ActivityIndicator size="small" color="#4ADE80" />
                        <Text style={styles.loadingText}>Guidance is blooming... 🌱</Text>
                    </View>
                )}
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask for guidance or share your thoughts..."
                    placeholderTextColor="#64748B"
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Send 🚀</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    backButton: {
        paddingRight: 16,
    },
    backButtonText: {
        color: '#38BDF8',
        fontSize: 14,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#4ADE80',
        fontSize: 16,
        fontWeight: 'bold',
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#1E293B',
        borderColor: '#334155',
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#064E3B',
        borderColor: '#059669',
    },
    bubbleText: {
        color: '#F8FAFC',
        fontSize: 14,
        lineHeight: 20,
    },
    loadingText: {
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 6,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#1E293B',
        borderTopWidth: 1,
        borderTopColor: '#334155',
        gap: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#0F172A',
        borderRadius: 8,
        padding: 12,
        color: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#334155',
        fontSize: 14,
    },
    sendButton: {
        backgroundColor: '#38BDF8',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#0F172A',
        fontWeight: 'bold',
        fontSize: 14,
    },
});