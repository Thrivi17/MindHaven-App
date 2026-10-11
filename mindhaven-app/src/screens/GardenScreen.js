import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { toggleBackgroundMusic } from '../utils/soundManager';

export default function GardenScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Safely parse initial stats from URL params or fallback to defaults
    const initialStreak = params.streak ? parseInt(params.streak, 10) : 1;
    const initialWater = params.waterDrops ? parseInt(params.waterDrops, 10) : 10;
    const initialSun = params.sunlight ? parseInt(params.sunlight, 10) : 5;
    const initialStage = params.stageIndex !== undefined ? parseInt(params.stageIndex, 10) : 0;

    const [streak, setStreak] = useState(isNaN(initialStreak) ? 1 : initialStreak);
    const [waterDrops, setWaterDrops] = useState(isNaN(initialWater) ? 10 : initialWater);
    const [sunlight, setSunlight] = useState(isNaN(initialSun) ? 5 : initialSun);
    const [stageIndex, setStageIndex] = useState(isNaN(initialStage) ? 0 : initialStage);

    const [modalVisible, setModalVisible] = useState(false);
    const [shopModalVisible, setShopModalVisible] = useState(false);
    const [achievementModalVisible, setAchievementModalVisible] = useState(false);
    const [themeModalVisible, setThemeModalVisible] = useState(false);
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [checkedInToday, setCheckedInToday] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    // Daily Dynamic Weather State
    const [dailyWeather, setDailyWeather] = useState({
        id: 'monsoon',
        name: 'Gentle Monsoon 🌧️',
        desc: 'Watering cost is halved (1 💧)! Perfect for rapid growth.',
        waterCostMultiplier: 0.5,
        rewardMultiplier: 1.0
    });

    // Randomize weather on load
    useEffect(() => {
        const possibleWeathers = [
            { id: 'monsoon', name: 'Gentle Monsoon 🌧️', desc: 'Watering cost is halved (1 💧)!', waterCostMultiplier: 0.5, rewardMultiplier: 1.0 },
            { id: 'heatwave', name: 'Summer Heatwave ☀️', desc: 'Sunlight rewards doubled, but watering cost is 3 💧.', waterCostMultiplier: 1.5, rewardMultiplier: 2.0 },
            { id: 'breeze', name: 'Autumn Breeze 🍃', desc: 'All resource rewards increased by +2!', waterCostMultiplier: 1.0, rewardMultiplier: 1.5 },
            { id: 'clear', name: 'Clear Skies ☁️', desc: 'Standard harmonious greenhouse conditions.', waterCostMultiplier: 1.0, rewardMultiplier: 1.0 }
        ];
        const randomWeather = possibleWeathers[Math.floor(Math.random() * possibleWeathers.length)];
        setDailyWeather(randomWeather);
    }, []);

    // Catch rewards returned from minigames / story / mindfulness activities safely without logging out
    useEffect(() => {
        if (params.rewardWater || params.rewardSun) {
            let addW = parseInt(params.rewardWater, 10) || 0;
            let addS = parseInt(params.rewardSun, 10) || 0;

            if (dailyWeather.id === 'heatwave') {
                addS *= 2;
            } else if (dailyWeather.id === 'breeze') {
                addW += 2;
                addS += 2;
            }

            setWaterDrops(prev => prev + addW);
            setSunlight(prev => prev + addS);

            Alert.alert('🎁 Weather-Buffed Rewards Claimed!', `Added +${addW} 💧 and +${addS} ☀️ with ${dailyWeather.name} active!`);

            // Clear params locally without forcing route stack reloads or re-authenticating
            router.setParams({ rewardWater: undefined, rewardSun: undefined, waterDrops: undefined, sunlight: undefined, stageIndex: undefined, streak: undefined });
        }
    }, [params]);

    const handleToggleMusic = async () => {
        try {
            Haptics.selectionAsync();
            const playing = await toggleBackgroundMusic();
            setIsMusicPlaying(playing);
        } catch (error) {
            console.log('Audio toggle error:', error);
        }
    };

    const availablePlants = [
        { id: 'flower', name: 'Sanctuary Blossom', emoji: '🌸', costWater: 0, costSun: 0, unlocked: true },
        { id: 'lavender', name: 'Calming Lavender', emoji: '🌿', costWater: 6, costSun: 4, unlocked: false },
        { id: 'bonsai', name: 'Focus Bonsai', emoji: '🪴', costWater: 10, costSun: 8, unlocked: false },
        { id: 'sunflower', name: 'Joyful Sunflower', emoji: '🌻', costWater: 15, costSun: 12, unlocked: false },
    ];

    const [plants, setPlants] = useState(availablePlants);
    const [activePlant, setActivePlant] = useState(availablePlants[0]);

    const availableThemes = [
        { id: 'classic', name: 'Classic Greenhouse', emoji: '🌿', bg: '#0F172A', cardBg: '#1E293B', border: '#334155', costWater: 0, costSun: 0, unlocked: true },
        { id: 'zen', name: 'Zen Rock Garden', emoji: '🪨', bg: '#18181B', cardBg: '#27272A', border: '#3F3F46', costWater: 10, costSun: 10, unlocked: false },
        { id: 'cyberpunk', name: 'Neon Cyber Greenhouse', emoji: '⚡', bg: '#09090B', cardBg: '#18181B', border: '#EC4899', costWater: 20, costSun: 15, unlocked: false },
        { id: 'forest', name: 'Enchanted Forest', emoji: '🌲', bg: '#022C22', cardBg: '#064E3B', border: '#059669', costWater: 15, costSun: 20, unlocked: false },
    ];

    const [themes, setThemes] = useState(availableThemes);
    const [activeTheme, setActiveTheme] = useState(availableThemes[0]);

    const initialAchievements = [
        { id: 'streak_7', title: 'Consistency King', desc: 'Reach a 7-day streak', icon: '🔥', target: 7, current: streak, unlocked: false, reward: { water: 5, sun: 5 } },
        { id: 'breathing_5', title: 'Breath Master', desc: 'Complete 5 mindful sessions', icon: '🌬️', target: 5, current: 2, unlocked: false, reward: { water: 4, sun: 6 } },
        { id: 'botanist', title: 'Master Botanist', desc: 'Unlock all 4 sanctuary plants', icon: '🌿', target: 4, current: 1, unlocked: false, reward: { water: 10, sun: 10 } },
    ];

    const [achievements, setAchievements] = useState(initialAchievements);

    const stages = [
        { name: 'Seedling in Soil', emoji: '🌰' },
        { name: 'Gentle Sprout', emoji: '🌱' },
        { name: 'Blooming Growth', emoji: '🌿' },
        { name: 'Thriving Ecosystem', emoji: '🌳' },
        { name: 'Majestic Sanctuary Tree', emoji: '✨' },
    ];

    const moodOptions = [
        { label: '🌿 Calm & Grounded', rewardWater: 4, rewardSun: 2 },
        { label: '☀️ Grateful & Uplifted', rewardWater: 5, rewardSun: 3 },
        { label: '🌊 Overwhelmed / Anxious', rewardWater: 3, rewardSun: 4 },
        { label: '🌙 Tired / Low Energy', rewardWater: 4, rewardSun: 3 },
    ];

    const handleSelectMood = (mood) => {
        let wBonus = mood.rewardWater;
        let sBonus = mood.rewardSun;

        if (dailyWeather.id === 'heatwave') sBonus *= 2;
        if (dailyWeather.id === 'breeze') { wBonus += 2; sBonus += 2; }

        setStreak(prev => prev + 1);
        setWaterDrops(prev => prev + wBonus);
        setSunlight(prev => prev + sBonus);
        setCheckedInToday(true);
        setModalVisible(false);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('✨ Check-in Recorded!', `Earned +${wBonus} 💧 and +${sBonus} ☀️ under ${dailyWeather.name}!`);
    };

    const handleUnlockPlant = (plantId) => {
        const targetPlant = plants.find(p => p.id === plantId);
        if (targetPlant.unlocked) {
            setActivePlant(targetPlant);
            setShopModalVisible(false);
            Haptics.selectionAsync();
            Alert.alert('🌿 Active Plant Switched', `Now nurturing the ${targetPlant.name}!`);
            return;
        }

        if (waterDrops < targetPlant.costWater || sunlight < targetPlant.costSun) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('☀️ Insufficient Resources!', `Needs ${targetPlant.costWater} 💧 and ${targetPlant.costSun} ☀️.`);
            return;
        }

        setWaterDrops(prev => prev - targetPlant.costWater);
        setSunlight(prev => prev - targetPlant.costSun);

        const updatedPlants = plants.map(p => p.id === plantId ? { ...p, unlocked: true } : p);
        setPlants(updatedPlants);
        setActivePlant({ ...targetPlant, unlocked: true });
        setShopModalVisible(false);

        const unlockedCount = updatedPlants.filter(p => p.unlocked).length;
        setAchievements(prev => prev.map(a => a.id === 'botanist' ? { ...a, current: unlockedCount } : a));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('✨ Seed Unlocked!', `Unlocked the ${targetPlant.name}!`);
    };

    const handleUnlockTheme = (themeId) => {
        const targetTheme = themes.find(t => t.id === themeId);
        if (targetTheme.unlocked) {
            setActiveTheme(targetTheme);
            setThemeModalVisible(false);
            Haptics.selectionAsync();
            Alert.alert('🎨 Theme Applied', `Switched to ${targetTheme.name}!`);
            return;
        }

        if (waterDrops < targetTheme.costWater || sunlight < targetTheme.costSun) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('☀️ Insufficient Resources!', `Needs ${targetTheme.costWater} 💧 and ${targetTheme.costSun} ☀️.`);
            return;
        }

        setWaterDrops(prev => prev - targetTheme.costWater);
        setSunlight(prev => prev - targetTheme.costSun);

        const updatedThemes = themes.map(t => t.id === themeId ? { ...t, unlocked: true } : t);
        setThemes(updatedThemes);
        setActiveTheme({ ...targetTheme, unlocked: true });
        setThemeModalVisible(false);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('✨ Theme Unlocked!', `Applied ${targetTheme.name}!`);
    };

    const handleClaimAchievement = (id) => {
        const targetAchievement = achievements.find(a => a.id === id);
        if (!targetAchievement || targetAchievement.unlocked || targetAchievement.current < targetAchievement.target) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('🔒 Locked', 'Milestone target not yet met!');
            return;
        }

        setWaterDrops(prev => prev + targetAchievement.reward.water);
        setSunlight(prev => prev + targetAchievement.reward.sun);
        setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('🏆 Achievement Claimed!', `Earned +${targetAchievement.reward.water} 💧 & +${targetAchievement.reward.sun} ☀️!`);
    };

    const handleWaterPlant = () => {
        const requiredWater = dailyWeather.id === 'heatwave' ? 3 : (dailyWeather.id === 'monsoon' ? 1 : 2);

        if (waterDrops < requiredWater) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('💧 Out of Water!', `Need ${requiredWater} 💧 to water your plant today.`);
            return;
        }

        if (stageIndex >= stages.length - 1) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('🌲 Max Evolution!', 'Your sanctuary plant is fully mature!');
            return;
        }

        setWaterDrops(prev => prev - requiredWater);
        setStageIndex(prev => prev + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert('🌱 Plant Nurtured!', `Grew into stage ${stageIndex + 2}!`);
    };

    const progressPercent = ((stageIndex + 1) / stages.length) * 100;

    return (
        <ScrollView
            style={[styles.screenWrapper, { backgroundColor: activeTheme.bg }]}
            contentContainerStyle={styles.container}
        >
            {/* Top Navigation Header with Sound Toggle & Hamburger Menu */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>MindHaven Sanctuary</Text>
                    <Text style={styles.subtitle}>Cultivate your mind, grow your ecosystem</Text>
                </View>
                <View style={styles.headerButtonsRow}>
                    <TouchableOpacity
                        style={[styles.menuIconButton, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}
                        onPress={handleToggleMusic}
                    >
                        <Text style={styles.menuIconText}>{isMusicPlaying ? '🔊' : '🔇'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuIconButton, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}
                        onPress={() => {
                            Haptics.selectionAsync();
                            setMenuModalVisible(true);
                        }}
                    >
                        <Text style={styles.menuIconText}>☰</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Daily Weather Banner */}
            <View style={[styles.weatherBanner, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                <Text style={styles.weatherTitle}>Today's Weather: {dailyWeather.name}</Text>
                <Text style={styles.weatherDesc}>{dailyWeather.desc}</Text>
            </View>

            {/* Resource HUD Bar */}
            <View style={[styles.hudContainer, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                <View style={styles.hudItem}>
                    <Text style={styles.hudEmoji}>💧</Text>
                    <Text style={styles.hudValue}>{waterDrops}</Text>
                    <Text style={styles.hudLabel}>Water</Text>
                </View>
                <View style={styles.hudItem}>
                    <Text style={styles.hudEmoji}>☀️</Text>
                    <Text style={styles.hudValue}>{sunlight}</Text>
                    <Text style={styles.hudLabel}>Sunlight</Text>
                </View>
                <View style={styles.hudItem}>
                    <Text style={styles.hudEmoji}>🔥</Text>
                    <Text style={styles.hudValue}>{streak}</Text>
                    <Text style={styles.hudLabel}>Streak</Text>
                </View>
            </View>

            {/* Main Garden Plot Card */}
            <View style={[styles.card, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                <Text style={styles.plantEmoji}>{activePlant.emoji}</Text>
                <Text style={styles.stageText}>{activePlant.name}</Text>
                <Text style={styles.subStageText}>Stage: {stages[stageIndex].name}</Text>

                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                </View>
                <Text style={styles.progressLabel}>Evolution Level {stageIndex + 1} of {stages.length}</Text>
            </View>

            {/* Core Action Buttons on Screen */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleWaterPlant}>
                <Text style={styles.primaryButtonText}>
                    Water Plant (Cost: {dailyWeather.id === 'heatwave' ? 3 : (dailyWeather.id === 'monsoon' ? 1 : 2)} 💧)
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.checkInButton, checkedInToday && styles.disabledButton]}
                onPress={() => {
                    if (!checkedInToday) {
                        Haptics.selectionAsync();
                        setModalVisible(true);
                    }
                }}
            >
                <Text style={styles.checkInButtonText}>
                    {checkedInToday ? '✅ Checked in Today' : '✨ Daily Mood Check-in'}
                </Text>
            </TouchableOpacity>

            {/* Scrollable Hamburger Dropdown / Modal Menu */}
            <Modal animationType="fade" transparent={true} visible={menuModalVisible} onRequestClose={() => setMenuModalVisible(false)}>
                <View style={styles.dropdownOverlay}>
                    <View style={[styles.dropdownContent, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                        <Text style={styles.dropdownHeader}>Sanctuary Menu 🌿</Text>

                        <ScrollView style={styles.dropdownScroll} contentContainerStyle={styles.dropdownScrollContent} showsVerticalScrollIndicator={true}>
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/story'); }}>
                                <Text style={styles.dropdownItemText}>📖 Story RPG: Aethelgard</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/diary'); }}>
                                <Text style={styles.dropdownItemText}>📓 Private Digital Diary</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/worry'); }}>
                                <Text style={styles.dropdownItemText}>🌊 Worry Release Stream</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/affirmations'); }}>
                                <Text style={styles.dropdownItemText}>🏮 Starlight Affirmations</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/gratitude'); }}>
                                <Text style={styles.dropdownItemText}>🌻 Three Good Things</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); setShopModalVisible(true); }}>
                                <Text style={styles.dropdownItemText}>🌱 Visit Plant Shop</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); setThemeModalVisible(true); }}>
                                <Text style={styles.dropdownItemText}>🎨 Custom Garden Themes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); setAchievementModalVisible(true); }}>
                                <Text style={styles.dropdownItemText}>🏆 Trophies & Milestones</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/breathing'); }}>
                                <Text style={styles.dropdownItemText}>🧘 Mindful Breathing</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/memory'); }}>
                                <Text style={styles.dropdownItemText}>🧩 Gratitude Memory Match</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/defense'); }}>
                                <Text style={styles.dropdownItemText}>🐛 Sanctuary Defense</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.dropdownItemChat} onPress={() => { setMenuModalVisible(false); router.push('/chat'); }}>
                                <Text style={styles.dropdownItemChatText}>💬 Talk to AI Wellness Guide</Text>
                            </TouchableOpacity>
                        </ScrollView>

                        <TouchableOpacity style={styles.closeMenuButton} onPress={() => setMenuModalVisible(false)}>
                            <Text style={styles.closeMenuText}>Close Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modals for Check-in, Shop, Themes, Achievements */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                        <Text style={styles.modalTitle}>How are you feeling today?</Text>
                        <Text style={styles.modalSubtitle}>Select your current state:</Text>
                        {moodOptions.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.moodOption} onPress={() => handleSelectMood(item)}>
                                <Text style={styles.moodOptionText}>{item.label}</Text>
                                <Text style={styles.moodRewardText}>+{item.rewardWater} 💧 +{item.rewardSun} ☀️</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeModalText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={shopModalVisible} onRequestClose={() => setShopModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                        <Text style={styles.modalTitle}>🌱 Sanctuary Plant Shop</Text>
                        <Text style={styles.modalSubtitle}>Unlock and switch species:</Text>
                        {plants.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.moodOption, activePlant.id === item.id && styles.activeShopItem]} onPress={() => handleUnlockPlant(item.id)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 24, marginRight: 12 }}>{item.emoji}</Text>
                                    <View>
                                        <Text style={styles.moodOptionText}>{item.name}</Text>
                                        <Text style={styles.moodRewardText}>{item.unlocked ? '✅ Unlocked (Tap to select)' : `Cost: ${item.costWater} 💧 | ${item.costSun} ☀️`}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setShopModalVisible(false)}>
                            <Text style={styles.closeModalText}>Close Shop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={themeModalVisible} onRequestClose={() => setThemeModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                        <Text style={styles.modalTitle}>🎨 Sanctuary Themes</Text>
                        <Text style={styles.modalSubtitle}>Unlock and customize your greenhouse aesthetic:</Text>
                        {themes.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.moodOption, activeTheme.id === item.id && styles.activeShopItem]} onPress={() => handleUnlockTheme(item.id)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 24, marginRight: 12 }}>{item.emoji}</Text>
                                    <View>
                                        <Text style={styles.moodOptionText}>{item.name}</Text>
                                        <Text style={styles.moodRewardText}>{item.unlocked ? '✅ Unlocked (Tap to select)' : `Cost: ${item.costWater} 💧 | ${item.costSun} ☀️`}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setThemeModalVisible(false)}>
                            <Text style={styles.closeModalText}>Close Themes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={achievementModalVisible} onRequestClose={() => setAchievementModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }]}>
                        <Text style={styles.modalTitle}>🏆 Sanctuary Trophies</Text>
                        <Text style={styles.modalSubtitle}>Complete habits to claim resources:</Text>
                        {achievements.map((item) => {
                            const isReady = item.current >= item.target && !item.unlocked;
                            return (
                                <TouchableOpacity key={item.id} style={[styles.moodOption, item.unlocked && styles.activeShopItem]} onPress={() => handleClaimAchievement(item.id)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <Text style={{ fontSize: 24, marginRight: 12 }}>{item.icon}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.moodOptionText}>{item.title}</Text>
                                            <Text style={styles.modalSubtitleMuted}>{item.desc}</Text>
                                            <Text style={styles.moodRewardText}>Progress: {item.current}/{item.target} {item.unlocked ? '✨ Claimed' : isReady ? '🎁 Claim!' : ''}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setAchievementModalVisible(false)}>
                            <Text style={styles.closeModalText}>Close Trophies</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screenWrapper: { flex: 1 },
    container: { flexGrow: 1, alignItems: 'center', padding: 20, paddingTop: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 360, marginBottom: 14 },
    headerButtonsRow: { flexDirection: 'row', gap: 8 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#4ADE80' },
    subtitle: { fontSize: 12, color: '#94A3B8' },
    menuIconButton: { width: 42, height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    menuIconText: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
    weatherBanner: { width: '100%', maxWidth: 360, borderRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, alignItems: 'center' },
    weatherTitle: { color: '#38BDF8', fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
    weatherDesc: { color: '#94A3B8', fontSize: 11, textAlign: 'center' },
    hudContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 360, borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1 },
    hudItem: { alignItems: 'center', flex: 1 },
    hudEmoji: { fontSize: 18 },
    hudValue: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
    hudLabel: { color: '#94A3B8', fontSize: 11 },
    card: { width: '100%', maxWidth: 360, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1 },
    plantEmoji: { fontSize: 72, marginBottom: 12 },
    stageText: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 2, textAlign: 'center' },
    subStageText: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },
    progressBarBackground: { width: '100%', height: 8, backgroundColor: '#0F172A', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
    progressBarFill: { height: '100%', backgroundColor: '#4ADE80' },
    progressLabel: { fontSize: 12, color: '#38BDF8' },
    primaryButton: { width: '100%', maxWidth: 360, height: 48, backgroundColor: '#38BDF8', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    primaryButtonText: { color: '#0F172A', fontSize: 15, fontWeight: 'bold' },
    checkInButton: { width: '100%', maxWidth: 360, height: 48, backgroundColor: '#4ADE80', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    disabledButton: { backgroundColor: '#334155' },
    checkInButtonText: { color: '#0F172A', fontSize: 15, fontWeight: 'bold' },
    dropdownOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 80, paddingRight: 20 },
    dropdownContent: { borderRadius: 16, padding: 16, width: 270, maxHeight: '70%', borderWidth: 1 },
    dropdownScroll: { maxHeight: 300 },
    dropdownScrollContent: { paddingRight: 4 },
    dropdownHeader: { color: '#4ADE80', fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    dropdownItem: { backgroundColor: '#0F172A', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
    dropdownItemText: { color: '#F8FAFC', fontSize: 13, fontWeight: '600' },
    dropdownItemChat: { backgroundColor: '#0F172A', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#38BDF8' },
    dropdownItemChatText: { color: '#38BDF8', fontSize: 13, fontWeight: 'bold' },
    closeMenuButton: { marginTop: 8, padding: 8, alignItems: 'center' },
    closeMenuText: { color: '#94A3B8', fontSize: 13 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', padding: 20 },
    modalContent: { borderRadius: 16, padding: 24, borderWidth: 1 },
    modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
    modalSubtitle: { color: '#94A3B8', fontSize: 13, marginBottom: 20, textAlign: 'center' },
    modalSubtitleMuted: { color: '#94A3B8', fontSize: 11, marginBottom: 2 },
    moodOption: { backgroundColor: '#0F172A', padding: 14, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
    moodOptionText: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
    moodRewardText: { color: '#4ADE80', fontSize: 12, fontWeight: 'bold' },
    closeModalButton: { marginTop: 10, padding: 10, alignItems: 'center' },
    closeModalText: { color: '#94A3B8', fontSize: 14 },
    activeShopItem: { borderColor: '#4ADE80', borderStyle: 'solid', borderWidth: 2 }
});