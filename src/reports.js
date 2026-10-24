import Alpine from "alpinejs";
import Chart from "chart.js/auto";

function dateOffset(daysAgo) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function createSampleOrders() {
  return [
    { id: 1001, daysAgo: 0, amount: 75000000, status: "completed" },
    { id: 1002, daysAgo: 0, amount: 9800000, status: "pending" },
    { id: 1003, daysAgo: 1, amount: 92000000, status: "processing" },
    { id: 1004, daysAgo: 2, amount: 12500000, status: "completed" },
    { id: 1005, daysAgo: 3, amount: 4300000, status: "cancelled" },
    { id: 1006, daysAgo: 4, amount: 18500000, status: "completed" },
    { id: 1007, daysAgo: 5, amount: 27000000, status: "completed" },
    { id: 1008, daysAgo: 6, amount: 35000000, status: "completed" },
    { id: 1009, daysAgo: 8, amount: 42000000, status: "completed" },
    { id: 1010, daysAgo: 10, amount: 22000000, status: "completed" },
    { id: 1011, daysAgo: 13, amount: 65000000, status: "completed" },
    { id: 1012, daysAgo: 16, amount: 18000000, status: "pending" },
    { id: 1013, daysAgo: 20, amount: 51000000, status: "completed" },
    { id: 1014, daysAgo: 24, amount: 33000000, status: "completed" },
    { id: 1015, daysAgo: 28, amount: 47000000, status: "completed" },
  ].map((order) => ({
    ...order,
    date: dateOffset(order.daysAgo),
  }));
}

Alpine.data("reportsPage", () => ({
  theme: "dark",
  period: "week",
  chart: null,
  chartReady: false,
  resizeHandler: null,

  orders: createSampleOrders(),

  bestProducts: [
    { name: "آیفون ۱۵ پرو", quantity: 18, revenue: 135000000 },
    { name: "MacBook Air M3", quantity: 9, revenue: 828000000 },
    { name: "AirPods Pro 2", quantity: 32, revenue: 313600000 },
    { name: "هدفون بی‌سیم", quantity: 24, revenue: 192000000 },
  ],

  init() {
    this.theme = localStorage.getItem("theme") === "light" ? "light" : "dark";

    this.$nextTick(() => {
      this.updateChart();
    });
  },

  get todayLabel() {
    return new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  },

  get filteredOrders() {
    const days = this.period === "today" ? 1 : this.period === "month" ? 30 : 7;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - days + 1);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.orders.filter((order) => {
      const orderDate = new Date(`${order.date}T12:00:00`);

      return orderDate >= start && orderDate <= end;
    });
  },

  get completedOrders() {
    return this.filteredOrders.filter((order) => order.status === "completed");
  },

  get totalSales() {
    return this.completedOrders.reduce((sum, order) => sum + order.amount, 0);
  },

  get averageOrder() {
    return this.completedOrders.length
      ? this.totalSales / this.completedOrders.length
      : 0;
  },

  money(value) {
    return `${Math.round(value).toLocaleString("fa-IR")} تومان`;
  },

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", this.theme);

    this.$nextTick(() => {
      this.updateChart();
    });
  },

  getChartSeries() {
    const days = this.period === "today" ? 1 : this.period === "month" ? 30 : 7;

    const labels = [];
    const values = [];

    if (this.period === "month") {
      // شش بازه پنج‌روزه
      for (let bucket = 0; bucket < 6; bucket++) {
        const firstDayAgo = 29 - bucket * 5;
        const lastDayAgo = Math.max(25 - bucket * 5, 0);

        const firstDate = new Date();
        firstDate.setHours(12, 0, 0, 0);
        firstDate.setDate(firstDate.getDate() - firstDayAgo);

        const lastDate = new Date();
        lastDate.setHours(12, 0, 0, 0);
        lastDate.setDate(lastDate.getDate() - lastDayAgo);

        labels.push(
          `${formatDate(dateOffset(firstDayAgo))} تا ${formatDate(dateOffset(lastDayAgo))}`,
        );

        const amount = this.completedOrders.reduce((sum, order) => {
          const date = new Date(`${order.date}T12:00:00`);

          return date >= firstDate && date <= lastDate
            ? sum + order.amount
            : sum;
        }, 0);

        values.push(amount);
      }
    } else {
      for (let i = days - 1; i >= 0; i--) {
        const dateString = dateOffset(i);
        labels.push(this.period === "today" ? "امروز" : formatDate(dateString));

        const amount = this.completedOrders
          .filter((order) => order.date === dateString)
          .reduce((sum, order) => sum + order.amount, 0);

        values.push(amount);
      }
    }

    return { labels, values };
  },

  updateChart() {
    const canvas = document.getElementById("salesChart");

    if (!canvas) return;

    const { labels, values } = this.getChartSeries();
    const light = this.theme === "light";
    const textColor = light ? "#6b7280" : "#a7a3b5";
    const gridColor = light
      ? "rgba(107, 114, 128, 0.13)"
      : "rgba(255, 255, 255, 0.07)";

    // اگر نمودار قبلاً ساخته شده، همان نمونه را به‌روزرسانی کن.
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;

      this.chart.options.scales.x.ticks.color = textColor;
      this.chart.options.scales.y.ticks.color = textColor;
      this.chart.options.scales.x.grid.color = gridColor;
      this.chart.options.scales.y.grid.color = gridColor;
      this.chart.options.plugins.legend.labels.color = textColor;

      this.chart.update();
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) return;

    const gradient = context.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, "rgba(52, 211, 153, 0.30)");
    gradient.addColorStop(0.65, "rgba(52, 211, 153, 0.07)");
    gradient.addColorStop(1, "rgba(52, 211, 153, 0.00)");

    this.chart = new Chart(context, {
      type: "line",

      data: {
        labels,
        datasets: [
          {
            label: "فروش (تومان)",
            data: values,
            borderColor: "#34d399",
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.38,
            cubicInterpolationMode: "monotone",
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: "#34d399",
            pointBorderColor: light ? "#ffffff" : "#1c1927",
            pointBorderWidth: 2,
            pointHitRadius: 12,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 100,
        animation: {
          duration: 450,
          easing: "easeOutQuart",
        },

        interaction: {
          intersect: false,
          mode: "index",
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            rtl: true,
            textDirection: "rtl",
            displayColors: false,
            backgroundColor: light ? "#ffffff" : "#272235",
            titleColor: light ? "#111827" : "#ffffff",
            bodyColor: light ? "#374151" : "#d1d5db",
            borderColor: light ? "#e5e7eb" : "rgba(255,255,255,0.10)",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,

            callbacks: {
              label: (context) =>
                ` فروش: ${Number(context.parsed.y).toLocaleString("fa-IR")} تومان`,
            },
          },
        },

        scales: {
          x: {
            border: { display: false },
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: this.period === "month" ? 6 : 7,
              font: {
                family: "Vazirmatn",
                size: 11,
              },
            },
          },

          y: {
            beginAtZero: true,
            border: { display: false },
            grid: {
              color: gridColor,
              drawTicks: false,
            },
            ticks: {
              color: textColor,
              padding: 10,
              maxTicksLimit: 6,
              font: {
                family: "Vazirmatn",
                size: 11,
              },
              callback(value) {
                const number = Number(value);

                if (number >= 1000000) {
                  return `${(number / 1000000).toLocaleString("fa-IR")} م`;
                }

                return number.toLocaleString("fa-IR");
              },
            },
          },
        },
      },
    });

    this.chartReady = true;
  },

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    this.chartReady = false;
  },
}));

window.Alpine = Alpine;
Alpine.start();
