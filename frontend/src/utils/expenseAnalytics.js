// const currencyFormatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
// })

// const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// const safeNumber = (value) => {
//   const parsed = Number(value)
//   return Number.isFinite(parsed) ? parsed : 0
// }

// const formatDateValue = (value) => {
//   if (!value) {
//     return ''
//   }

//   const parsedDate = new Date(value)
//   if (Number.isNaN(parsedDate.getTime())) {
//     return ''
//   }

//   return parsedDate.toISOString().slice(0, 10)
// }

// const getExpenseDate = (expense) => {
//   const dateValue = expense?.date ?? expense?.createdAt ?? expense?.expenseDate ?? expense?.timestamp ?? ''
//   return formatDateValue(dateValue)
// }

// const getCategoryName = (expense) => {
//   const fromCategory = expense?.category?.name?.trim()
//   if (fromCategory) {
//     return fromCategory
//   }

//   if (expense?.categoryName) {
//     return expense.categoryName
//   }

//   if (expense?.categoryId) {
//     return `Category ${expense.categoryId}`
//   }

//   return 'Uncategorized'
// }

// const getUserIdValue = (expense) => {
//   const directUserId = expense?.userId ?? expense?.user?.id ?? ''
//   return directUserId ? String(directUserId) : ''
// }

// export const formatCurrency = (value) => currencyFormatter.format(safeNumber(value))

// export const calculateFinanceSummary = (expenses = []) => {
//   const totalIncome = expenses.reduce((sum, expense) => {
//     if (expense?.type === 'INCOME') {
//       return sum + safeNumber(expense.amount)
//     }

//     return sum
//   }, 0)

//   const totalExpenses = expenses.reduce((sum, expense) => {
//     if (expense?.type === 'EXPENSE' || !expense?.type) {
//       return sum + safeNumber(expense.amount)
//     }

//     return sum
//   }, 0)

//   const totalBalance = totalIncome - totalExpenses

//   return {
//     totalIncome,
//     totalExpenses,
//     totalBalance,
//   }
// }

// export const groupExpensesByDay = (expenses = []) => {
//   const buckets = DAY_NAMES.map((day) => ({ label: day, value: 0 }))

//   expenses.forEach((expense) => {
//     const expenseDate = getExpenseDate(expense)
//     if (!expenseDate) {
//       return
//     }

//     const parsedDate = new Date(expenseDate)
//     if (Number.isNaN(parsedDate.getTime())) {
//       return
//     }

//     const dayIndex = (parsedDate.getDay() + 6) % 7
//     buckets[dayIndex].value += safeNumber(expense.amount)
//   })

//   return buckets
// }

// export const groupExpensesByCategory = (expenses = []) => {
//   const groups = expenses.reduce((accumulator, expense) => {
//     const label = getCategoryName(expense)
//     if (!accumulator[label]) {
//       accumulator[label] = 0
//     }

//     accumulator[label] += safeNumber(expense.amount)
//     return accumulator
//   }, {})

//   return Object.entries(groups)
//     .map(([label, value]) => ({ label, value }))
//     .sort((left, right) => right.value - left.value)
// }

// export const filterExpenses = (expenses = [], filters = {}) => {
//   const { userId = '', category = '', dateFrom = '', dateTo = '' } = filters

//   return expenses.filter((expense) => {
//     const matchesUser = !userId || getUserIdValue(expense) === String(userId)
//     const matchesCategory = !category || getCategoryName(expense).toLowerCase() === category.toLowerCase()

//     const expenseDate = getExpenseDate(expense)
//     const matchesDateFrom = !dateFrom || expenseDate >= dateFrom
//     const matchesDateTo = !dateTo || expenseDate <= dateTo

//     return matchesUser && matchesCategory && matchesDateFrom && matchesDateTo
//   })
// }

// export const sortExpenses = (expenses = [], sortOption = 'date-desc') => {
//   const sortedExpenses = [...expenses]

//   if (sortOption === 'amount-asc') {
//     return sortedExpenses.sort((left, right) => safeNumber(left.amount) - safeNumber(right.amount))
//   }

//   if (sortOption === 'amount-desc') {
//     return sortedExpenses.sort((left, right) => safeNumber(right.amount) - safeNumber(left.amount))
//   }

//   if (sortOption === 'date-asc') {
//     return sortedExpenses.sort((left, right) => getExpenseDate(left).localeCompare(getExpenseDate(right)))
//   }

//   return sortedExpenses.sort((left, right) => getExpenseDate(right).localeCompare(getExpenseDate(left)))
// }

// export const exportExpensesToCsv = (expenses = [], fileName = 'expenses.csv') => {
//   const rows = [
//     ['Title', 'Amount', 'User ID', 'Category', 'Date'],
//     ...expenses.map((expense) => [
//       expense.title ?? 'Untitled expense',
//       safeNumber(expense.amount),
//       getUserIdValue(expense),
//       getCategoryName(expense),
//       getExpenseDate(expense),
//     ]),
//   ]

//   const csvContent = rows
//     .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
//     .join('\n')

//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//   const link = document.createElement('a')
//   link.href = URL.createObjectURL(blob)
//   link.download = fileName
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   URL.revokeObjectURL(link.href)
// }
// ==========================================
// 1. FORMATTING & MATH UTILS
// ==========================================

export const formatCurrency = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
};

export const calculateFinanceSummary = (expenses) => {
  if (!expenses || !expenses.length) {
    return { totalBalance: 0, totalIncome: 0, totalExpenses: 0, netSavings: 0 };
  }

  let totalIncome = 0;
  let totalExpenses = 0;

  expenses.forEach(exp => {
    const amount = Number(exp.amount) || 0;
    if (exp.type === 'INCOME') {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
    }
  });

  const totalBalance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    totalBalance,
    netSavings: totalBalance
  };
};

// ==========================================
// 2. FILTERING & SORTING UTILS
// ==========================================

export const filterExpenses = (expenses, { category, dateFrom, dateTo }) => {
  if (!expenses) return [];
  
  return expenses.filter(exp => {
    const expCategory = exp.category?.name || exp.category || 'General';
    const expDate = exp.date ? new Date(exp.date).setHours(0, 0, 0, 0) : null;
    const from = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0) : null;
    const to = dateTo ? new Date(dateTo).setHours(23, 59, 59, 999) : null;

    if (category && expCategory !== category) return false;
    if (from && expDate && expDate < from) return false;
    if (to && expDate && expDate > to) return false;
    
    return true;
  });
};

export const sortExpenses = (expenses, sortOption) => {
  if (!expenses) return [];
  
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    const amountA = Number(a.amount) || 0;
    const amountB = Number(b.amount) || 0;

    switch (sortOption) {
      case 'date-desc': return dateB - dateA;
      case 'date-asc': return dateA - dateB;
      case 'amount-desc': return amountB - amountA;
      case 'amount-asc': return amountA - amountB;
      default: return dateB - dateA;
    }
  });
};

// ==========================================
// 3. CHART DATA UTILS (Updated for Spring Boot)
// ==========================================

export const groupExpensesByCategory = (expenses) => {
  if (!expenses || !expenses.length) return [];

  const grouped = expenses.reduce((acc, curr) => {
    if (curr.type !== 'INCOME') {
      const categoryName = curr.category?.name || curr.category || 'General';
      const amount = Number(curr.amount) || 0;
      acc[categoryName] = (acc[categoryName] || 0) + amount;
    }
    return acc;
  }, {});

  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
};

export const groupExpensesByDay = (expenses) => {
  const days = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  
  if (!expenses || !expenses.length) {
    return Object.entries(days).map(([label, value]) => ({ label, value }));
  }

  expenses.forEach(curr => {
    if (curr.type !== 'INCOME') {
      const dateString = curr.date ? curr.date : new Date().toISOString();
      const date = new Date(dateString);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); 
      
      const amount = Number(curr.amount) || 0;

      if (days[dayName] !== undefined) {
        days[dayName] += amount;
      }
    }
  });
  
  return Object.entries(days).map(([label, value]) => ({ label, value }));
};

// ==========================================
// 4. EXPORT UTILS
// ==========================================

export const exportExpensesToCsv = (expenses, filename) => {
  if (!expenses || !expenses.length) return;
  
  const headers = ['Title', 'Amount', 'Type', 'Category', 'Date'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(e => {
      const categoryName = e.category?.name || e.category || 'General';
      return [
        `"${e.title || ''}"`,
        e.amount || 0,
        e.type || 'EXPENSE',
        `"${categoryName}"`,
        e.date || ''
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};