<template>
  <div class="page-container">
    <Filters />
    <Table
        :data="paginatedData"
        :loading="isLoading"
        :error="error"
    />
    <Pagination
        v-if="totalItems > 0"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        @page-changed="handlePageChange"
    />
    <div v-if="!isLoading && totalItems === 0" class="no-results">
      Ничего не найдено
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppState } from '~/composables/states'

const {
  paginatedData,
  isLoading,
  error,
  currentPage,
  itemsPerPage,
  totalItems,
  fetchData
} = useAppState()

const handlePageChange = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 15px;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}
</style>
