import Alpine from "alpinejs";

Alpine.data("ordersPage", () => ({
  dark: true,
  sidebarOpen: false,
  search: "",
  statusFilter: "all",
  notice: "",
  noticeTimeout: null,

  orders: [
    {
      id: "ORD-1001",
      customer: "علی محمدی",
      date: "۱۴۰۵/۰۷/۲۰",
      total: 75000000,
      status: "completed",
    },
    {
      id: "ORD-1002",
      customer: "مریم رضایی",
      date: "۱۴۰۵/۰۷/۲۰",
      total: 9800000,
      status: "pending",
    },
    {
      id: "ORD-1003",
      customer: "محمد کریمی",
      date: "۱۴۰۵/۰۷/۱۹",
      total: 92000000,
      status: "processing",
    },
    {
      id: "ORD-1004",
      customer: "سارا احمدی",
      date: "۱۴۰۵/۰۷/۱۸",
      total: 12500000,
      status: "pending",
    },
    {
      id: "ORD-1005",
      customer: "رضا حسینی",
      date: "۱۴۰۵/۰۷/۱۷",
      total: 4300000,
      status: "cancelled",
    },
  ],

  init() {
    this.dark = (localStorage.getItem("theme") || "dark") === "dark";
    this.applyTheme();

    try {
      const saved = JSON.parse(localStorage.getItem("panelOrders") || "null");

      if (Array.isArray(saved)) {
        this.orders = saved;
      }
    } catch (error) {
      console.warn("اطلاعات سفارش‌ها قابل خواندن نبود.", error);
    }
  },

  get filteredOrders() {
    const query = this.search.toLocaleLowerCase("fa");

    return this.orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLocaleLowerCase("fa").includes(query) ||
        order.customer.toLocaleLowerCase("fa").includes(query);

      const matchesStatus =
        this.statusFilter === "all" || order.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  },

  applyTheme() {
    document.documentElement.classList.toggle("dark", this.dark);
    document.documentElement.classList.toggle("light", !this.dark);
  },

  toggleTheme() {
    this.dark = !this.dark;

    localStorage.setItem("theme", this.dark ? "dark" : "light");

    this.applyTheme();
  },

  formatPrice(value) {
    return Number(value || 0).toLocaleString("fa-IR");
  },

  statusLabel(status) {
    const labels = {
      pending: "در انتظار بررسی",
      processing: "در حال آماده‌سازی",
      completed: "تکمیل‌شده",
      cancelled: "لغوشده",
    };

    return labels[status] || "نامشخص";
  },

  statusClass(status) {
    const classes = {
      pending: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
      processing: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      completed: "bg-green-500/15 text-green-600 dark:text-green-400",
      cancelled: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    };

    return classes[status] || "bg-gray-500/10 text-gray-500";
  },

  changeStatus(id, status) {
    const validStatuses = ["pending", "processing", "completed", "cancelled"];

    if (!validStatuses.includes(status)) return;

    this.orders = this.orders.map((order) =>
      order.id === id ? { ...order, status } : order,
    );

    try {
      localStorage.setItem("panelOrders", JSON.stringify(this.orders));

      this.showNotice("وضعیت سفارش به‌روزرسانی شد.");
    } catch (error) {
      this.showNotice("ذخیره‌سازی سفارش‌ها انجام نشد.");
    }
  },

  showNotice(message) {
    this.notice = message;

    window.clearTimeout(this.noticeTimeout);

    this.noticeTimeout = window.setTimeout(() => {
      this.notice = "";
    }, 2800);
  },
}));

window.Alpine = Alpine;
Alpine.start();
