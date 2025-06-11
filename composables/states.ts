import { ref, computed, watch } from 'vue';

export interface VoiceMessage {
    Received: string;
    From: string;
    To: string;
    Date: string;
    MIME: {
        MIME: {
            'Disposition-filename': string;
        };
    };
    Duration: string;
}

export const useAppState = () => {
    const tableData = ref<VoiceMessage[]>([]);
    const filteredData = ref<VoiceMessage[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const periodFilter = ref('all');
    const numberFilter = ref('');
    const durationFilter = ref('all');
    const isDataLoaded = ref(false);
    const API_URL = 'https://68401ff45b39a8039a56e295.mockapi.io/api/v1/messages';

    watch([periodFilter, numberFilter, durationFilter], () => {
        applyFilters();
    });

    const fetchData = async () => {
        if (isDataLoaded.value && tableData.value.length > 0) {
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Expected array data');

            tableData.value = data;
            isDataLoaded.value = true;
            applyFilters();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error';
        } finally {
            isLoading.value = false;
        }
    };

    const applyFilters = () => {
        if (!isDataLoaded.value || tableData.value.length === 0) {
            filteredData.value = [];
            return;
        }

        let result = [...tableData.value];

        if (periodFilter.value !== 'all') {
            result = result.filter(filterByPeriod);
        }

        if (numberFilter.value.trim()) {
            result = result.filter(filterByNumber);
        }

        if (durationFilter.value !== 'all') {
            result = result.filter(filterByDuration);
        }

        filteredData.value = result;
        currentPage.value = 1;
    };

    const filterByPeriod = (item: VoiceMessage) => {
        if (periodFilter.value === 'all') return true;

        try {
            const itemDate = new Date(item.Received);
            const now = new Date();

            if (periodFilter.value === 'today') {
                return (
                    itemDate.getDate() === now.getDate() &&
                    itemDate.getMonth() === now.getMonth() &&
                    itemDate.getFullYear() === now.getFullYear()
                );
            }

            if (periodFilter.value === 'yesterday') {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                return (
                    itemDate.getDate() === yesterday.getDate() &&
                    itemDate.getMonth() === yesterday.getMonth() &&
                    itemDate.getFullYear() === yesterday.getFullYear()
                );
            }

            return true;
        } catch (err) {
            console.error('Date filtering error:', err);
            return false;
        }
    };

    const filterByNumber = (item: VoiceMessage) => {
        if (!numberFilter.value.trim()) return true;
        const searchTerm = numberFilter.value.trim().toLowerCase();
        return item.To.toLowerCase().includes(searchTerm) || item.From.toLowerCase().includes(searchTerm);
    };

    const filterByDuration = (item: VoiceMessage) => {
        if (durationFilter.value === 'all') return true;
        const duration = parseInt(item.Duration) || 0;
        switch (durationFilter.value) {
            case 'lt1': return duration < 60;
            case 'lt3': return duration < 180;
            case 'lt5': return duration < 300;
            case 'lt10': return duration < 600;
            default: return true;
        }
    };

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return filteredData.value.slice(start, end);
    });

    const totalItems = computed(() => filteredData.value.length);
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

    watch(filteredData, () => {
        if (currentPage.value > totalPages.value && totalPages.value > 0) {
            currentPage.value = totalPages.value;
        }
    });

    const resetFilters = () => {
        periodFilter.value = 'all';
        numberFilter.value = '';
        durationFilter.value = 'all';
    };

    return {
        tableData,
        filteredData,
        paginatedData,
        isLoading,
        error,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        periodFilter,
        numberFilter,
        durationFilter,
        fetchData,
        applyFilters,
        resetFilters,
        isDataLoaded
    };
};
