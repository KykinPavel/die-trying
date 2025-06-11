<template>
  <div class="filters-container">
    <div class="header-section">
      <h1 class="title">Голосовая почта</h1>
      <div class="separator"></div>
    </div>

    <div class="filter-row">
      <div class="filter-group">
        <label class="filter-label">Период</label>
        <select class="form-select" v-model="period" @change="handleApplyFilters">
          <option v-for="option in periodOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Номер</label>
        <div class="search-input">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" class="bi bi-search rotated-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input
              type="text"
              class="form-control"
              placeholder=""
              v-model="number"
              @input="handleApplyFilters"
          >
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">Длительность</label>
        <div class="duration-input">
          <select class="form-select" v-model="duration" @change="handleApplyFilters">
            <option v-for="option in durationOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <button class="btn btn-reset" @click="handleResetFilters">Сбросить фильтр</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useAppState } from '~/composables/states';

const {
  periodFilter,
  numberFilter,
  durationFilter,
  applyFilters,
  resetFilters,
  fetchData,
  isDataLoaded
} = useAppState();

const period = ref(periodFilter.value);
const number = ref(numberFilter.value);
const duration = ref(durationFilter.value);

watch([periodFilter, numberFilter, durationFilter], ([newPeriod, newNumber, newDuration]) => {
  period.value = newPeriod;
  number.value = newNumber;
  duration.value = newDuration;
});

const periodOptions = [
  { value: 'all', text: 'Все время' },
  { value: 'today', text: 'Сегодня' },
  { value: 'yesterday', text: 'Вчера' },
];

const durationOptions = [
  { value: 'all', text: 'Все' },
  { value: 'lt1', text: 'До 1 минуты' },
  { value: 'lt3', text: 'До 3 минут' },
  { value: 'lt5', text: 'До 5 минут' },
  { value: 'lt10', text: 'До 10 минут' },
];

onMounted(async () => {
  if (!isDataLoaded.value) {
    await fetchData();
  }
});

const handleApplyFilters = () => {
  periodFilter.value = period.value;
  numberFilter.value = number.value;
  durationFilter.value = duration.value;
};

const handleResetFilters = () => {
  period.value = 'all';
  number.value = '';
  duration.value = 'all';
  resetFilters();
};
</script>

<style scoped>
.filters-container {
  max-width: 1000px;
  margin: 0 auto 20px;
  padding: 0 15px;
}

.header-section {
  margin-bottom: 20px;
}

.title {
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 10px;
}

.separator {
  height: 1px;
  background-color: #dee2e6;
  width: 100%;
}

.filter-row {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
}

.filter-label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #000;
  font-weight: 500;
}

.form-control,
.form-select {
  transition: all 0.3s ease;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  width: 100%;
  height: 38px;
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: #618fbb;
  box-shadow: 0 0 0 0.2rem rgba(97, 143, 187, 0.25);
}

.search-input {
  position: relative;
}

.search-input svg {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%) rotate(95deg);
  pointer-events: none;
}

.search-input .form-control {
  padding-left: 35px;
}

.btn-reset {
  color: #618fbb;
  background-color: transparent;
  border: 1px dashed #618fbb;
  padding: 0.375rem 1rem;
  margin-bottom: 1px;
  transition: all 0.3s ease;
  border-radius: 4px;
  height: 38px;
  white-space: nowrap;
}

.btn-reset:hover {
  background-color: rgba(97, 143, 187, 0.1);
  border-style: solid;
}
</style>
