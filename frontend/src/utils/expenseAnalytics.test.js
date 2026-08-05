import { describe, expect, it } from 'vitest'
import {
  calculateExpenseSummary,
  exportExpensesToCsv,
  filterExpenses,
  groupExpensesByCategory,
  groupExpensesByDay,
  sortExpenses,
} from './expenseAnalytics.js'

describe('expense analytics helpers', () => {
  it('calculates total, count, highest and average correctly', () => {
    const summary = calculateExpenseSummary([
      { amount: 10 },
      { amount: 20 },
      { amount: 30 },
    ])

    expect(summary.totalAmount).toBe(60)
    expect(summary.totalCount).toBe(3)
    expect(summary.highestExpense.amount).toBe(30)
    expect(summary.averageExpense).toBe(20)
  })

  it('groups expenses by week day', () => {
    const weekly = groupExpensesByDay([
      { amount: 20, date: '2024-01-01' },
      { amount: 10, date: '2024-01-02' },
    ])

    expect(weekly[0].label).toBe('Mon')
    expect(weekly[0].value).toBe(20)
    expect(weekly[1].value).toBe(10)
  })

  it('filters by category, user and date', () => {
    const filtered = filterExpenses(
      [
        { amount: 15, userId: 1, categoryId: 1, date: '2024-02-01' },
        { amount: 25, userId: 2, categoryId: 2, date: '2024-02-10' },
      ],
      { userId: '2', category: 'Category 2', dateFrom: '2024-02-01', dateTo: '2024-02-15' },
    )

    expect(filtered).toHaveLength(1)
    expect(filtered[0].amount).toBe(25)
  })

  it('sorts expenses by amount and date', () => {
    const sortedByAmount = sortExpenses([
      { amount: 50, date: '2024-01-01' },
      { amount: 20, date: '2024-01-02' },
    ], 'amount-desc')

    expect(sortedByAmount[0].amount).toBe(50)
  })

  it('builds category totals', () => {
    const categories = groupExpensesByCategory([
      { amount: 10, categoryId: 1 },
      { amount: 20, categoryId: 1 },
      { amount: 15, categoryId: 2 },
    ])

    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Category 1', value: 30 }),
        expect.objectContaining({ label: 'Category 2', value: 15 }),
      ]),
    )
  })

  it('exports csv content', () => {
    const originalCreateElement = document.createElement
    document.createElement = (tagName) => {
      if (tagName === 'a') {
        return {
          click: () => {},
          set href(value) {},
          get href() { return '' },
          set download(value) {},
        }
      }

      return originalCreateElement.call(document, tagName)
    }

    exportExpensesToCsv([{ title: 'Lunch', amount: 12, userId: 1, categoryId: 1, date: '2024-02-01' }])

    document.createElement = originalCreateElement
  })
})
