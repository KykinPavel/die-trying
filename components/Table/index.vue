<template>
  <div class="table-container">
    <div v-if="loading" class="text-center py-4">Loading...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="data.length === 0" class="no-data-message">
      Нет данных для отображения
    </div>

    <table v-else class="table table-striped">
      <thead>
      <tr class="header-row">
        <th class="date-column">Дата</th>
        <th class="number-column">Номер</th>
        <th class="message-column">Запись сообщения</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in data" :key="index" class="table-row">
        <td class="date-cell">{{ formatDateTime(item.Received) }}</td>
        <td class="number-cell">{{ item.To }}</td>
        <td class="message-cell">
          <div class="message-controls">
            <button
                @click="togglePlay(item)"
                class="btn-play"
                :class="{ 'is-playing': isPlaying(item) }"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path v-if="!isPlaying(item)" d="M13 8L4 3V13L13 8Z" fill="currentColor"/>
                <path v-if="isPlaying(item)" d="M5 3H7V13H5V3ZM11 3H9V13H11V3Z" fill="currentColor"/>
              </svg>
            </button>
            <span class="duration">{{ formatDuration(item.Duration) }}</span>
            <div class="progress-container">
              <div
                  class="progress-bar"
                  :style="{
                      width: isPlaying(item) ? `${progress}%` : '0%'
                    }"
              ></div>
            </div>
            <span class="duration">{{ isPlaying(item) ? currentTimeFormatted : formatDuration(item.Duration) }}</span>
            <button class="btn-download" @click="downloadItem(item)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 11L3 6H6V0H10V6H13L8 11Z" fill="#618FBB"/>
                <path d="M0 13H16V15H0V13Z" fill="#618FBB"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, onMounted } from 'vue'
import superMarioAudio from '~/assets/superMario.mp3'
import type { VoiceMessage } from '~/composables/states'

const props = defineProps<{
  data: VoiceMessage[]
  loading: boolean
  error: string | null
}>()

const audioContext = ref<AudioContext | null>(null)
const audioBuffer = ref<AudioBuffer | null>(null)
const audioSource = ref<AudioBufferSourceNode | null>(null)
const currentPlayingId = ref<string | null>(null)
const progress = ref(0)
const currentTime = ref(0)
const currentTimeFormatted = ref('00:00')
const startTime = ref(0)
let animationFrameId = ref<number | null>(null)

const initAudioContext = async () => {
  try {
    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    const response = await fetch(superMarioAudio)
    const arrayBuffer = await response.arrayBuffer()
    audioBuffer.value = await audioContext.value.decodeAudioData(arrayBuffer)
  } catch (error) {
    console.error('Error initializing audio:', error)
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatDuration = (duration: string) => {
  const seconds = parseInt(duration)
  if (isNaN(seconds)) return '00:00'
  return formatTime(seconds)
}

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date')
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}.${month} ${hours}:${minutes}`
  } catch (e) {
    return dateString
  }
}

const updateProgress = () => {
  if (audioContext.value && startTime.value) {
    const elapsed = audioContext.value.currentTime - startTime.value
    currentTime.value = Math.min(elapsed, audioBuffer.value?.duration || 0)
    currentTimeFormatted.value = formatTime(currentTime.value)
    progress.value = (currentTime.value / (audioBuffer.value?.duration || 1)) * 100

    if (currentTime.value < (audioBuffer.value?.duration || 0)) {
      animationFrameId.value = requestAnimationFrame(updateProgress)
    } else {
      stopAudio()
    }
  }
}

const isPlaying = (item: VoiceMessage) => {
  return currentPlayingId.value === item.MIME.MIME['Disposition-filename']
}

const togglePlay = async (item: VoiceMessage) => {
  const itemId = item.MIME.MIME['Disposition-filename']

  if (isPlaying(item)) {
    stopAudio()
    return
  }

  stopAudio()

  if (!audioContext.value) {
    await initAudioContext()
  }

  if (!audioBuffer.value) return

  currentPlayingId.value = itemId
  audioSource.value = audioContext.value!.createBufferSource()
  audioSource.value.buffer = audioBuffer.value
  audioSource.value.connect(audioContext.value!.destination)

  startTime.value = audioContext.value!.currentTime
  audioSource.value.start(0)

  animationFrameId.value = requestAnimationFrame(updateProgress)

  audioSource.value.onended = () => {
    stopAudio()
  }
}

const stopAudio = () => {
  if (audioSource.value) {
    audioSource.value.stop()
    audioSource.value.disconnect()
    audioSource.value = null
  }

  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }

  currentPlayingId.value = null
  progress.value = 0
  currentTime.value = 0
  currentTimeFormatted.value = '00:00'
  startTime.value = 0
}

onUnmounted(() => {
  stopAudio()
  if (audioContext.value) {
    audioContext.value.close()
  }
})

const downloadItem = async (item: VoiceMessage) => {
  const filename = item.MIME.MIME['Disposition-filename'] ||
      `voice_message_${new Date(item.Received).getTime()}.mp3`

  try {
    const response = await fetch(superMarioAudio)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error)
  }
}
</script>

<style scoped>
.table-container {
  max-width: 1000px;
  margin: 0 auto 20px;
  padding: 0 15px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.table th,
.table td {
  border: none;
  color: #000;
  padding: 12px 8px;
}

.header-row {
  border-bottom: 2px solid #c47479;
}

.header-row th {
  color: #000;
  font-weight: 500;
  width: 130px;
}

.date-column {
  width: 120px;
}

.number-column {
  width: 250px;
}

.message-column {
  width: auto;
}

.table-row:hover {
  background-color: rgba(97, 143, 187, 0.1) !important;
}

.table-row:hover .date-cell,
.table-row:hover .number-cell {
  color: #c47479;
}

.message-cell {
  max-width: 500px;
}

.message-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-play {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #618FBB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-play:hover {
  background-color: #4a7ba8;
  transform: scale(1.05);
}

.btn-play:active {
  transform: scale(0.95);
}

.btn-play.is-playing {
  background-color: #28a745;
}

.btn-play.is-playing:hover {
  background-color: #218838;
}

.btn-play svg {
  width: 16px;
  height: 16px;
}

.progress-container {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  width: 150px;
}

.progress-bar {
  height: 100%;
  background-color: #618FBB;
  border-radius: 4px;
  transition: width 0.1s linear;
}

.duration {
  color: #6c757d;
  font-size: 0.9rem;
  min-width: 40px;
  text-align: center;
}

.btn-download {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-download:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.btn-download:active {
  transform: scale(0.95);
}
</style>
