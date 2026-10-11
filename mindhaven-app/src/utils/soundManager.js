import { Audio } from 'expo-av';

let soundObject = null;
let isPlaying = false;

export async function toggleBackgroundMusic() {
    try {
        // Ensure audio mode is configured to play in silent mode on iOS
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
        });

        if (!soundObject) {
            soundObject = new Audio.Sound();

            // Load and play the ambient track
            await soundObject.loadAsync(
                { uri: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf756.mp3?filename=ambient-piano-logo-16535.mp3' },
                { shouldPlay: true, isLooping: true, volume: 0.5 }
            );
            isPlaying = true;
        } else {
            const status = await soundObject.getStatusAsync();
            if (status.isLoaded) {
                if (status.isPlaying) {
                    await soundObject.pauseAsync();
                    isPlaying = false;
                } else {
                    await soundObject.playAsync();
                    isPlaying = true;
                }
            }
        }
        return isPlaying;
    } catch (error) {
        console.log('Error toggling background music:', error);
        return false;
    }
}

export function getAudioState() {
    return isPlaying;
}