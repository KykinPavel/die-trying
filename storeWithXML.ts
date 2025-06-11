// import { ref, computed } from 'vue'
// import { useXmlParser } from './useXmlParser'
//
// interface VoiceMessage {
//     Received: string
//     From: string
//     To: string
//     Date: {
//         localTime: string
//         timeShift: string
//         _: string
//     }
//     MIME: {
//         class: string
//         estimatedSize: string
//         subtype: string
//         type: string
//         MIME: {
//             disposition: string
//             'Disposition-filename': string
//             'Disposition-voice': string
//             estimatedSize: string
//             partID: string
//             subtype: string
//             type: string
//         }
//     }
//     Duration: string
//     audioUrl?: string
// }
//
// export const useAppState = () => {
//     const tableData = ref<VoiceMessage[]>([])
//     const filteredData = ref<VoiceMessage[]>([])
//     const isLoading = ref(false)
//     const error = ref<string | null>(null)
//     const currentPage = ref(1)
//     const itemsPerPage = ref(10)
//
//     // Фильтры
//     const periodFilter = ref('all')
//     const numberFilter = ref('')
//     const durationFilter = ref('all')
//
//     const { parseXmlToJson } = useXmlParser()
//
//     const fetchData = async () => {
//         isLoading.value = true
//         error.value = null
//
//         try {
//             const response = await fetch('/data.xml')
//             const xmlString = await response.text()
//             const jsonData = await parseXmlToJson(xmlString)
//
//             if (jsonData?.Root?.Data) {
//                 const allData = Array.isArray(jsonData.Root.Data)
//                     ? jsonData.Root.Data
//                     : [jsonData.Root.Data]
//                 tableData.value = allData
//                 applyFilters()
//             }
//         } catch (err: any) {
//             error.value = err.message
//             console.error('Failed to load data:', err)
//         } finally {
//             isLoading.value = false
//         }
//     }
//
//     const applyFilters = () => {
//         let result = [...tableData.value]
//         // Фильтр по периоду
//         if (periodFilter.value !== 'all') {
//             const now = new Date()
//             result = result.filter(item => {
//                 const itemDate = new Date(item.Received)
//                 if (periodFilter.value === 'today') {
//                     return itemDate.toDateString() === now.toDateString()
//                 } else if (periodFilter.value === 'Yesterday') {
//                     const yesterday = new Date(now)
//                     yesterday.setDate(yesterday.getDate() - 1)
//                     return itemDate.toDateString() === yesterday.toDateString()
//                 }
//                 return true
//             })
//         }
//         // Фильтр по номеру
//         if (numberFilter.value) {
//             const searchTerm = numberFilter.value.toLowerCase()
//             result = result.filter(item =>
//                 item.To.toLowerCase().includes(searchTerm) ||
//                 item.From.toLowerCase().includes(searchTerm))
//         }
//
//         // Фильтр по длительности
//         if (durationFilter.value !== 'all') {
//             result = result.filter(item => {
//                 const duration = parseInt(item.Duration)
//
//                 switch(durationFilter.value) {
//                     case 'lt1': return duration < 60
//                     case 'lt3': return duration < 180
//                     case 'lt5': return duration < 300
//                     case 'lt10': return duration < 600
//                     default: return true
//                 }
//             })
//         }
//
//         filteredData.value = result
//         currentPage.value = 1 // Сброс на первую страницу при изменении фильтров
//     }
//
//     const paginatedData = computed(() => {
//         const start = (currentPage.value - 1) * itemsPerPage.value
//         const end = start + itemsPerPage.value
//         return filteredData.value.slice(start, end)
//     })
//
//     const totalItems = computed(() => filteredData.value.length)
//
//     const resetFilters = () => {
//         periodFilter.value = 'all'
//         numberFilter.value = ''
//         durationFilter.value = 'all'
//         applyFilters()
//     }
//
//     return {
//         tableData,
//         paginatedData,
//         isLoading,
//         error,
//         currentPage,
//         itemsPerPage,
//         totalItems,
//         periodFilter,
//         numberFilter,
//         durationFilter,
//         fetchData,
//         applyFilters,
//         resetFilters
//     }
// }
