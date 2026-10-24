import Alpine from "alpinejs";

const defaultSettings = {
  storeName: "فروشگاه من",
  managerName: "",
  email: "",
  phone: "",
  address: "",
  minimumStock: 5,
  shippingMethod: "post",

  notifications: {
    newOrders: true,
    lowStock: true,
    emailUpdates: false,
  },
};

function createDefaultSettings() {
  return JSON.parse(JSON.stringify(defaultSettings));
}

window.settingsPage = function () {
  return {
    isDark: true,

    settings: createDefaultSettings(),

    toast: {
      show: false,
      message: "",
    },

    toastTimer: null,

    notificationOptions: [
      {
        key: "newOrders",
        title: "اعلان سفارش‌های جدید",
        description: "اعلان سفارش‌های جدید در تنظیمات فعال باشد.",
      },
      {
        key: "lowStock",
        title: "هشدار کمبود موجودی",
        description: "هشدار کم شدن موجودی محصولات فعال باشد.",
      },
      {
        key: "emailUpdates",
        title: "به‌روزرسانی‌های ایمیلی",
        description: "گزینه اعلان‌های ایمیلی فعال باشد.",
      },
    ],

    init() {
      this.loadSettings();
      this.loadTheme();
    },

    loadSettings() {
      try {
        const saved = localStorage.getItem("panelSettings");

        if (!saved) {
          this.settings = createDefaultSettings();
          return;
        }

        const parsed = JSON.parse(saved);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          this.settings = createDefaultSettings();
          return;
        }

        this.settings = {
          ...createDefaultSettings(),
          ...parsed,

          minimumStock: Math.max(
            0,
            Number(parsed.minimumStock ?? defaultSettings.minimumStock) || 0,
          ),

          notifications: {
            ...defaultSettings.notifications,
            ...(parsed.notifications || {}),
          },
        };

        if (
          !["post", "courier", "express", "pickup"].includes(
            this.settings.shippingMethod,
          )
        ) {
          this.settings.shippingMethod = "post";
        }
      } catch (error) {
        console.error("خطا در خواندن تنظیمات:", error);
        this.settings = createDefaultSettings();
      }
    },

    loadTheme() {
      try {
        const savedTheme = localStorage.getItem("theme");

        this.isDark = savedTheme === null ? true : savedTheme === "dark";
      } catch (error) {
        this.isDark = true;
        console.error("خطا در خواندن تم:", error);
      }

      this.applyTheme();
    },

    setTheme(darkMode) {
      this.isDark = Boolean(darkMode);
      this.applyTheme();

      try {
        localStorage.setItem("theme", this.isDark ? "dark" : "light");
      } catch (error) {
        console.error("خطا در ذخیره تم:", error);
      }
    },

    toggleTheme() {
      this.setTheme(!this.isDark);
    },

    applyTheme() {
      document.documentElement.classList.toggle("dark", this.isDark);

      document.documentElement.style.colorScheme = this.isDark
        ? "dark"
        : "light";
    },

    saveSettings() {
      try {
        const minimumStock = Number(this.settings.minimumStock);

        if (!Number.isFinite(minimumStock) || minimumStock < 0) {
          this.showToast("حداقل موجودی باید عدد صفر یا بیشتر باشد.");
          return;
        }

        this.settings.minimumStock = Math.floor(minimumStock);

        localStorage.setItem("panelSettings", JSON.stringify(this.settings));

        this.showToast("تنظیمات با موفقیت ذخیره شد.");
      } catch (error) {
        console.error("خطا در ذخیره تنظیمات:", error);
        this.showToast("ذخیره انجام نشد؛ فضای ذخیره‌سازی مرورگر را بررسی کن.");
      }
    },

    resetSettings() {
      const confirmed = window.confirm(
        "آیا می‌خواهی تمام تنظیمات این صفحه به حالت اولیه برگردند؟",
      );

      if (!confirmed) return;

      this.settings = createDefaultSettings();

      try {
        localStorage.setItem("panelSettings", JSON.stringify(this.settings));

        this.showToast("تنظیمات به حالت اولیه برگشتند.");
      } catch (error) {
        console.error("خطا در بازگردانی تنظیمات:", error);
        this.showToast("ذخیره تنظیمات اولیه انجام نشد.");
      }
    },

    showToast(message) {
      this.toast.message = message;
      this.toast.show = true;

      if (this.toastTimer !== null) {
        clearTimeout(this.toastTimer);
      }

      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
        this.toastTimer = null;
      }, 3000);
    },
  };
};

window.Alpine = Alpine;
Alpine.start();
