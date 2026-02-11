<script setup lang="ts">
import { computed, ref } from 'vue'
import { feedingMonths, quickRules } from './data/feedingPlan'

const selectedMonth = ref(feedingMonths[0]?.month ?? 6)
const keyword = ref('')
const showMonthSheet = ref(false)
const controlsRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const activeMonth = computed(() => {
  return feedingMonths.find((month) => month.month === selectedMonth.value) ?? feedingMonths[0]
})

const filteredPlans = computed(() => {
  const month = activeMonth.value
  if (!month) {
    return []
  }

  const search = keyword.value.trim().toLowerCase()
  if (!search) {
    return month.plans
  }

  return month.plans.filter((day) => {
    if (day.dayLabel.toLowerCase().includes(search)) {
      return true
    }
    return day.slots.some((slot) => slot.toLowerCase().includes(search))
  })
})

const stats = computed(() => {
  const month = activeMonth.value
  if (!month) {
    return []
  }

  return [
    { label: '月龄阶段', value: `${month.month}月龄` },
    { label: '当月计划', value: `${month.plans.length} 天` },
    { label: '喂养性状', value: month.texture || '见详细说明' }
  ]
})

function pickMonth(month: number): void {
  selectedMonth.value = month
  showMonthSheet.value = false
}

function focusSearch(): void {
  showMonthSheet.value = false
  controlsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.setTimeout(() => {
    searchInputRef.value?.focus()
  }, 240)
}

function backToTop(): void {
  showMonthSheet.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="app-shell">
    <header class="hero">
      <div class="hero-badge">崔玉涛辅食表 · 6-12月龄</div>
      <h1>宝宝辅食怎么吃</h1>
      <p>按月龄查看每日辅食安排，支持关键词搜索，帮助你快速规划一天怎么喂。</p>
    </header>

    <section ref="controlsRef" class="card controls-card">
      <div class="month-tabs" role="tablist" aria-label="月龄选择">
        <button
          v-for="month in feedingMonths"
          :key="month.month"
          class="month-tab"
          :class="{ active: selectedMonth === month.month }"
          @click="selectedMonth = month.month"
        >
          {{ month.month }}月龄
        </button>
      </div>

      <label class="search-box">
        <span>搜索食材 / 菜名</span>
        <input
          ref="searchInputRef"
          v-model.trim="keyword"
          type="search"
          placeholder="例如：猪肝、南瓜、小馄饨"
        />
      </label>
    </section>

    <section v-if="activeMonth" class="card month-summary">
      <div class="title-row">
        <div>
          <h2>{{ activeMonth.title }}</h2>
          <p class="subtitle">{{ activeMonth.subtitle }}</p>
        </div>
      </div>

      <div class="stats-grid">
        <article v-for="item in stats" :key="item.label" class="stat-item">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value">{{ item.value }}</div>
        </article>
      </div>

      <div class="meta-list">
        <p><strong>目标：</strong>{{ activeMonth.goal }}</p>
        <p><strong>喂养量：</strong>{{ activeMonth.feedingAmount }}</p>
      </div>
    </section>

    <section v-if="activeMonth" class="card">
      <h3 class="section-title">本月喂养重点</h3>
      <ul class="focus-list">
        <li v-for="tip in activeMonth.highlights" :key="tip">{{ tip }}</li>
      </ul>
    </section>

    <section v-if="activeMonth" class="card plans-card">
      <div class="section-header">
        <h3>每日喂养安排</h3>
        <span class="result-tag">{{ filteredPlans.length }} 条</span>
      </div>

      <div class="mobile-plan-list">
        <article v-for="day in filteredPlans" :key="day.dayLabel" class="day-card">
          <div class="day-head">{{ day.dayLabel }}</div>
          <ul class="day-slots">
            <li v-for="(slot, index) in day.slots" :key="`${day.dayLabel}-${index}`">
              <span class="slot-time">{{ activeMonth.timeHeaders[index] || `时段${index + 1}` }}</span>
              <span class="slot-food">{{ slot || '-' }}</span>
            </li>
          </ul>
        </article>
      </div>

      <div class="desktop-table-wrap">
        <div class="table-scroll">
          <table class="plan-table">
            <thead>
              <tr>
                <th>日期</th>
                <th v-for="header in activeMonth.timeHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in filteredPlans" :key="day.dayLabel">
                <th>{{ day.dayLabel }}</th>
                <td v-for="(slot, index) in day.slots" :key="`${day.dayLabel}-${index}`">
                  {{ slot || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="filteredPlans.length === 0" class="empty-text">未找到匹配项，换个关键词试试。</p>
    </section>

    <section class="card">
      <h3 class="section-title">通用规则</h3>
      <ul class="rules-list">
        <li v-for="rule in quickRules" :key="rule">{{ rule }}</li>
      </ul>
    </section>

    <footer class="footer-note">本页面用于家庭喂养参考，不替代医疗诊断。</footer>

    <div
      v-if="showMonthSheet"
      class="fab-overlay"
      @click="showMonthSheet = false"
      aria-hidden="true"
    ></div>

    <section v-if="showMonthSheet" class="month-sheet" aria-label="快速月龄切换">
      <div class="month-sheet-handle" aria-hidden="true"></div>
      <p class="month-sheet-title">快速切换月龄</p>
      <div class="month-sheet-grid">
        <button
          v-for="month in feedingMonths"
          :key="`quick-${month.month}`"
          class="month-sheet-item"
          :class="{ active: selectedMonth === month.month }"
          @click="pickMonth(month.month)"
        >
          {{ month.month }}月龄
        </button>
      </div>
    </section>

    <nav class="mobile-fab" aria-label="快捷操作">
      <button class="mobile-fab-item" :class="{ active: showMonthSheet }" @click="showMonthSheet = !showMonthSheet">
        <span class="fab-icon" aria-hidden="true">🗓</span>
        <span class="fab-label">{{ showMonthSheet ? '收起' : '月龄' }}</span>
      </button>
      <button class="mobile-fab-item" @click="focusSearch">
        <span class="fab-icon" aria-hidden="true">🔎</span>
        <span class="fab-label">搜索</span>
      </button>
      <button class="mobile-fab-item" @click="backToTop">
        <span class="fab-icon" aria-hidden="true">↑</span>
        <span class="fab-label">顶部</span>
      </button>
    </nav>
  </main>
</template>
