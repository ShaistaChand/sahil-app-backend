// RTL language utilities


export const getOppositeAlignment = (language, alignment) => {
  if (!isRTL(language)) return alignment;
  return alignment === 'left' ? 'right' : 'left';
};

// Language configuration
export const languages = {
  en: {
    name: 'English',
    dir: 'ltr',
    flag: '🇺🇸'
  },
  ar: {
    name: 'العربية',
    dir: 'rtl',
    flag: '🇦🇪'
  }
};

// Simple translation function (expand as needed)
export const translations = {
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    createGroup: 'Create Group',
    addExpense: 'Add Expense',
    totalSpent: 'Total Spent',
    thisMonth: 'This Month',
    categories: 'Categories',
    recentExpenses: 'Recent Expenses',
    yourLatestTransactions: 'Your latest transactions',
    noExpensesYet: 'No expenses yet',
    startTracking: 'Start tracking your expenses by adding your first transaction',
    addFirstExpense: 'Add Your First Expense',
    upgradeToBasic: 'Upgrade to Basic Plan',
    startSplitting: 'Start splitting expenses like a pro with group features',
    billedMonthly: 'Billed monthly • Cancel anytime',
    maybeLater: 'Maybe Later',
    subscribeNow: 'Subscribe Now',
    revenueModel: 'Revenue Model: Monthly subscription + 1.5% transaction fees',
    securePayment: 'Secure payment processed by'
  },
  ar: {
    welcome: 'أهلاً وسهلاً',
    dashboard: 'لوحة التحكم',
    createGroup: 'إنشاء مجموعة',
    addExpense: 'إضافة مصروف',
    totalSpent: 'إجمالي الإنفاق',
    thisMonth: 'هذا الشهر',
    categories: 'الفئات',
    recentExpenses: 'المصروفات الأخيرة',
    yourLatestTransactions: 'أحدث معاملاتك',
    noExpensesYet: 'لا توجد مصروفات بعد',
    startTracking: 'ابدأ بتتبع مصروفاتك بإضافة أول معاملة',
    addFirstExpense: 'أضف أول مصروف لك',
    upgradeToBasic: 'الترقية إلى الخطة الأساسية',
    startSplitting: 'ابدأ بتقسيم المصروفات مثل المحترفين مع ميزات المجموعة',
    billedMonthly: 'مدفوعة شهرياً • إلغاء في أي وقت',
    maybeLater: 'ربما لاحقاً',
    subscribeNow: 'اشترك الآن',
    revenueModel: 'نموذج الإيرادات: اشتراك شهري + 1.5% رسوم معاملة',
    securePayment: 'دفع آمن تتم معالجته بواسطة'
  }
};

export const isRTL = (language) => language === 'ar';
export const getTextDirection = (language) => isRTL(language) ? 'rtl' : 'ltr';


export const t = (key, language = 'en') => {
  return translations[language]?.[key] || translations['en'][key] || key;
};



// export const isRTL = (language) => {
//   return ['ar', 'he', 'ur', 'fa'].includes(language);
// };

// export const getTextDirection = (language) => {
//   return isRTL(language) ? 'rtl' : 'ltr';
// };