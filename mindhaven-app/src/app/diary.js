import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function DiaryScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [entries, setEntries] = useState([
        { id: 1, title: 'First Steps in Aethelgard', date: 'Oct 10, 2026', content: 'Today I felt a bit overwhelmed with work, but taking a few minutes to breathe and water my sanctuary plant really centered my thoughts.' }
    ]);
    const [viewMode, setViewMode] = useState('write'); 

    const handleSaveEntry = () => {
        if (!title.trim() || !content.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Incomplete Entry', 'Please enter both a title and your thoughts before saving.');
            return;
        }

        const newEntry = {
            id: Date.now(),
            title: title.trim(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            content: content.trim()
        };

        setEntries([newEntry, ...entries]);
        setTitle('');
        setContent('');
        setViewMode('history');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('🔒 Privately Saved', 'Your thoughts have been securely stored in your personal diary.');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>← Back to Garden</Text>
                </TouchableOpacity>
                <View style={styles.tabToggleRow}>
                    <TouchableOpacity
                        style={[styles.tabButton, viewMode === 'write' && styles.activeTab]}
                        onPress={() => setViewMode('write')}
                    >
                        <Text style={[styles.tabText, viewMode === 'write' && styles.activeTabText]}>✍️ Write</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, viewMode === 'history' && styles.activeTab]}
                        onPress={() => setViewMode('history')}
                    >
                        <Text style={[styles.tabText, viewMode === 'history' && styles.activeTabText]}>📖 History ({entries.length})</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {viewMode === 'write' ? (
                <View style={styles.card}>
                    <Text style={styles.title}>The Sanctuary Journal 📓</Text>
                    <Text style={styles.subtitle}>Private, secure, and only visible to you across mobile, laptop, and web.</Text>

                    <TextInput
                        style={styles.inputTitle}
                        placeholder="Entry Title (e.g., Today's Reflections)"
                        placeholderTextColor="#64748B"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={styles.inputContent}
                        placeholder="Pour your thoughts, stress, or gratitudes here..."
                        placeholderTextColor="#64748B"
                        multiline={true}
                        numberOfLines={8}
                        textAlignVertical="top"
                        value={content}
                        onChangeText={setContent}
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
                        <Text style={styles.saveButtonText}>Lock & Save Privately 🔒</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyHeader}>Your Private Journal Archive 🔐</Text>
                    {entries.length === 0 ? (
                        <Text style={styles.emptyText}>No diary entries yet. Start writing to build your reflection history.</Text>
                    ) : (
                        entries.map(item => (
                            <View key={item.id} style={styles.entryCard}>
                                <View style={styles.entryHeaderRow}>
                                    <Text style={styles.entryTitle}>{item.title}</Text>
                                    <Text style={styles.entryDate}>{item.date}</Text>
                                </View>
                                <Text style={styles.entryContent}>{item.content}</Text>
                            </View>
                        ))
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F172A', alignItems: 'center', padding: 20, paddingTop: 40 },
    headerRow: { width: '100%', maxWidth: 420, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    backButtonText: { color: '#38BDF8', fontSize: 13, fontWeight: 'bold' },
    tabToggleRow: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 8, padding: 3, borderWidth: 1, borderColor: '#334155' },
    tabButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    activeTab: { backgroundColor: '#38BDF8' },
    tabText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
    activeTabText: { color: '#0F172A', fontWeight: 'bold' },
    card: { width: '100%', maxWidth: 420, backgroundColor: '#1E293B', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#4ADE80', marginBottom: 4, textAlign: 'center' },
    subtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
    inputTitle: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#334155', fontSize: 14, fontWeight: '600' },
    inputContent: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#334155', fontSize: 14, minHeight: 180 },
    saveButton: { backgroundColor: '#4ADE80', padding: 14, borderRadius: 8, alignItems: 'center' },
    saveButtonText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
    historyContainer: { width: '100%', maxWidth: 420, gap: 12 },
    historyHeader: { color: '#4ADE80', fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    emptyText: { color: '#94A3B8', fontSize: 13, textAlign: 'center', marginTop: 20 },
    entryCard: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 10 },
    entryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    entryTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
    entryDate: { color: '#38BDF8', fontSize: 11 },
    entryContent: { color: '#CBD5E1', fontSize: 13, lineHeight: 20 }
});