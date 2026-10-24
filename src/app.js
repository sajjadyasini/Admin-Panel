document.addEventListener("alpine:init", () => {
  Alpine.data("dashboard", () => ({
    sidebarOpen: false,

    stats: [
      {
        title: "فروش کل",
        value: "۱۲۵,۸۰۰,۰۰۰",
        unit: "تومان",
        icon: "wallet",
        color: "purple",
      },
      {
        title: "سفارش‌ها",
        value: "۱,۲۸۴",
        unit: "سفارش",
        icon: "shopping-bag",
        color: "blue",
      },
      {
        title: "مشتریان",
        value: "۸۴۲",
        unit: "نفر",
        icon: "users",
        color: "emerald",
      },
      {
        title: "محصولات",
        value: "۳۶۸",
        unit: "محصول",
        icon: "package",
        color: "orange",
      },
    ],

    orders: [
      {
        id: "#ORD-1024",
        customer: "علی محمدی",
        product: "هدفون بی‌سیم",
        amount: "۲,۴۵۰,۰۰۰",
        status: "تکمیل‌شده",
      },
      {
        id: "#ORD-1025",
        customer: "سارا احمدی",
        product: "کیبورد مکانیکی",
        amount: "۳,۸۰۰,۰۰۰",
        status: "در حال پردازش",
      },
      {
        id: "#ORD-1026",
        customer: "رضا کریمی",
        product: "ماوس گیمینگ",
        amount: "۱,۲۰۰,۰۰۰",
        status: "در انتظار",
      },
      {
        id: "#ORD-1027",
        customer: "مریم رضایی",
        product: "پایه لپ‌تاپ",
        amount: "۹۵۰,۰۰۰",
        status: "تکمیل‌شده",
      },
    ],
  }));
});
