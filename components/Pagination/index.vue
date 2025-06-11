<template>
  <nav aria-label="Page navigation" class="pagination-container">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="prevPage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#618fbb" stroke-width="1" fill="#fff"/>
            <path d="M14 16L10 12L14 8" stroke="#618fbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </li>
      <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
        <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="nextPage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#618fbb" stroke-width="1" fill="#fff"/>
            <path d="M10 8L14 12L10 16" stroke="#618fbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  totalItems: {
    type: Number,
    default: 100
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
})

const emit = defineEmits(['page-changed'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const visiblePages = computed(() => {
  const pages = []
  let startPage = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2))
  let endPage = startPage + props.maxVisiblePages - 1

  if (endPage > totalPages.value) {
    endPage = totalPages.value
    startPage = Math.max(1, endPage - props.maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('page-changed', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('page-changed', props.currentPage + 1)
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-changed', page)
  }
}
</script>

<style scoped>
.pagination-container {
  max-width: 1000px;
  margin: 20px auto 0;
  padding: 0 15px;
}

.pagination {
  display: flex;
  padding-left: 0;
  list-style: none;
  flex-wrap: wrap;
}

.page-item:first-child .page-link {
  margin-left: 0;
  border-radius: 0;
}

.page-item:last-child .page-link {
  border-radius: 0;
}

.page-link {
  position: relative;
  display: block;
  padding: 0.5rem 0.75rem;
  margin-left: 0;
  line-height: 1.25;
  color: #618fbb;
  background-color: #fff;
  border: none !important;
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-link:hover {
  z-index: 2;
  color: #4a7ba8;
  background-color: #e9ecef;
}

.page-link:focus {
  z-index: 3;
  outline: 0;
  box-shadow: none !important;
}

.page-item.active .page-link {
  z-index: 3;
  color: #495057;
  background-color: #e9ecef;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  cursor: not-allowed;
  background-color: #fff;
  opacity: 0.6;
}
</style>
