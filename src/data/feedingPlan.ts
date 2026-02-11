import rawData from './data.txt?raw'
import type { FeedingDayPlan, FeedingMonthData } from '../types'

const MONTH_BLOCK_REGEX = /(\d{1,2}月龄宝宝辅食：[^\n]+)([\s\S]*?)(?=\n\d{1,2}月龄宝宝辅食：|$)/g

function normalize(raw: string): string {
  return raw
    .replace(/\r/g, '')
    .replace(/^以下是.*?\n+/u, '')
    .replace(/^=====\s*Page\s*\d+\s*=====\s*\n?/gm, '')
    .trim()
}

function parseDayLine(line: string, headerLength: number): FeedingDayPlan | null {
  const dayMatch = line.match(/^(\d{1,2}\+\d{1,2})\s+(.+)$/)

  if (!dayMatch) {
    return null
  }

  const [, dayLabel, rest] = dayMatch
  const slots = rest.split(/\s+/)

  if (slots.length < headerLength) {
    const filledSlots = [...slots]
    while (filledSlots.length < headerLength) {
      filledSlots.push('')
    }

    return { dayLabel, slots: filledSlots }
  }

  if (slots.length > headerLength) {
    const merged = slots.slice(0, headerLength - 1)
    merged.push(slots.slice(headerLength - 1).join(' '))
    return { dayLabel, slots: merged }
  }

  return { dayLabel, slots }
}

function parseMonthBlock(titleLine: string, body: string): FeedingMonthData | null {
  const titleMatch = titleLine.match(/^(\d{1,2})月龄宝宝辅食：(.+)$/)

  if (!titleMatch) {
    return null
  }

  const month = Number(titleMatch[1])
  const subtitle = titleMatch[2].trim()
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const headerIndex = lines.findIndex((line) => line.startsWith('月份 '))
  if (headerIndex === -1) {
    return null
  }

  const timeHeaders = lines[headerIndex].replace(/^月份\s+/, '').split(/\s+/)
  const goalIndex = lines.findIndex((line) => line.startsWith('目标：'))
  const dayLines = lines
    .slice(headerIndex + 1, goalIndex > -1 ? goalIndex : lines.length)
    .filter((line) => /^\d{1,2}\+\d{1,2}\s+/.test(line))

  const plans = dayLines
    .map((line) => parseDayLine(line, timeHeaders.length))
    .filter((item): item is FeedingDayPlan => Boolean(item))

  const goal = lines.find((line) => line.startsWith('目标：'))?.replace('目标：', '') ?? ''
  const feedingAmount = lines.find((line) => line.startsWith('喂养量：'))?.replace('喂养量：', '') ?? ''
  const texture = lines.find((line) => line.startsWith('辅食性状：'))?.replace('辅食性状：', '') ?? ''

  const highlightStart = lines.findIndex((line) => line.includes('喂养重点'))
  const highlights =
    highlightStart > -1
      ? lines.slice(highlightStart + 1).filter((line) => /^\d+、/.test(line))
      : []

  return {
    month,
    title: `${month}月龄宝宝辅食`,
    subtitle,
    timeHeaders,
    plans,
    goal,
    feedingAmount,
    texture,
    highlights
  }
}

function parseFeedingData(raw: string): FeedingMonthData[] {
  const content = normalize(raw)
  const months: FeedingMonthData[] = []

  for (const matched of content.matchAll(MONTH_BLOCK_REGEX)) {
    const titleLine = matched[1].trim()
    const body = matched[2].trim()
    const parsed = parseMonthBlock(titleLine, body)
    if (parsed) {
      months.push(parsed)
    }
  }

  return months.sort((a, b) => a.month - b.month)
}

function patchSevenMonthData(months: FeedingMonthData[]): FeedingMonthData[] {
  const day1730Map: Record<string, string> = {
    '7+18': '米粉+蔬菜泥',
    '7+19': '米粉+蔬菜泥',
    '7+20': '米粉+红薯泥',
    '7+21': '米粉+红薯泥',
    '7+22': '米粉+南瓜泥',
    '7+23': '米粉+南瓜泥',
    '7+24': '米粉+胡萝卜泥',
    '7+25': '米粉+猪肝粉',
    '7+26': '米粉+猪肝粉',
    '7+27': '米粉+玉米泥',
    '7+28': '米粉+玉米泥',
    '7+29': '米粉+菠菜泥',
    '7+30': '米粉+菠菜泥'
  }

  return months.map((month) => {
    if (month.month !== 7) {
      return month
    }

    const headers = month.timeHeaders.length >= 6 ? month.timeHeaders : [...month.timeHeaders, '17:30']
    const targetIndex = headers.findIndex((header) => header === '17:30')

    const plans = month.plans.map((plan) => {
      const slots = [...plan.slots]

      while (slots.length < headers.length) {
        slots.push('')
      }

      const extraMeal = day1730Map[plan.dayLabel]
      if (targetIndex > -1 && extraMeal) {
        slots[targetIndex] = extraMeal
      }

      return {
        ...plan,
        slots
      }
    })

    return {
      ...month,
      timeHeaders: headers,
      plans
    }
  })
}

export const feedingMonths = patchSevenMonthData(parseFeedingData(rawData))

export const quickRules = [
  '新食材采用“连续 3 天观察法”，确认不过敏再加新食物。',
  '辅食形态按月龄逐步过渡：稀糊 → 小颗粒 → 块状 → 软饭。',
  '奶仍是重要营养来源，随月龄逐步减奶增饭。',
  '坚持少盐少糖，1岁内尽量不额外调味。',
  '通过手指食物和勺子练习，逐步培养宝宝自主进食。'
]
