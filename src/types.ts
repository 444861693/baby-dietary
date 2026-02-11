export interface FeedingDayPlan {
  dayLabel: string
  slots: string[]
}

export interface FeedingMonthData {
  month: number
  title: string
  subtitle: string
  timeHeaders: string[]
  plans: FeedingDayPlan[]
  goal: string
  feedingAmount: string
  texture: string
  highlights: string[]
}
