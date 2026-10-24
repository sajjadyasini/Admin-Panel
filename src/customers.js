import Alpine from "alpinejs";

const defaultCustomers = [
  {
    id: 1,
    name: "علی محمدی",
    phone: "09121234567",
    email: "ali@example.com",
    orders: 8,
    status: "active",
  },
  {
    id: 2,
    name: "مریم رضایی",
    phone: "09129876543",
    email: "maryam@example.com",
    orders: 5,
    status: "active",
  },
  {
    id: 3,
    name: "محمد کریمی",
    phone: "09351234567",
    email: "mohammad@example.com",
    orders: 2,
    status: "inactive",
  },
  {
    id: 4,
    name: "سارا احمدی",
    phone: "09901234567",
    email: "sara@example.com",
    orders: 11,
    status: "active",
  },
  {
    id: 5,
    name: "رضا حسینی",
    phone: "09105551234",
    email: "reza@example.com",
    orders: 1,
    status: "inactive",
  },
];

Alpine.data("customersPage", () => ({
  customers: [],
  search: "",
  statusFilter: "all",
  theme: "dark",

  // مهم: پنجره از ابتدا بسته است
  modalOpen: false,
  editingId: null,

  toast: "",
  toastTimer: null,

  form: {
    name: "",
    phone: "",
    email: "",
    status: "active",
  },

  init() {
    this.modalOpen = false;

    try {
      const saved = localStorage.getItem("panelCustomers");

      if (saved !== null) {
        const parsed = JSON.parse(saved);
        this.customers = Array.isArray(parsed) ? parsed : [...defaultCustomers];
      } else {
        this.customers = [...defaultCustomers];
        this.saveToStorage();
      }
    } catch (error) {
      console.error("خطا در خواندن مشتریان:", error);
      this.customers = [...defaultCustomers];
    }

    this.theme = localStorage.getItem("theme") === "light" ? "light" : "dark";

    this.applyTheme();
  },

  get filteredCustomers() {
    const term = this.search.trim().toLowerCase();

    return this.customers.filter((customer) => {
      const matchesSearch = [
        customer.name,
        customer.phone,
        customer.email,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      );

      const matchesStatus =
        this.statusFilter === "all" || customer.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  },

  saveToStorage() {
    try {
      localStorage.setItem("panelCustomers", JSON.stringify(this.customers));
    } catch (error) {
      console.error("خطا در ذخیره مشتریان:", error);
      this.showToast("ذخیره اطلاعات انجام نشد.");
    }
  },

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", this.theme);
    this.applyTheme();
  },

  applyTheme() {
    document.documentElement.style.colorScheme = this.theme;
  },

  resetForm() {
    this.form = {
      name: "",
      phone: "",
      email: "",
      status: "active",
    };

    this.editingId = null;
  },

  openAddModal() {
    this.resetForm();
    this.modalOpen = true;
  },

  editCustomer(customer) {
    this.editingId = customer.id;

    this.form = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      status: customer.status,
    };

    this.modalOpen = true;
  },

  closeModal() {
    this.modalOpen = false;
    this.resetForm();
  },

  saveCustomer() {
    const name = this.form.name.trim();
    const phone = this.form.phone.trim();
    const email = this.form.email.trim();

    if (!name || !phone) {
      this.showToast("نام و شماره موبایل الزامی است.");
      return;
    }

    const duplicatePhone = this.customers.some(
      (customer) => customer.phone === phone && customer.id !== this.editingId,
    );

    if (duplicatePhone) {
      this.showToast("این شماره موبایل قبلاً ثبت شده است.");
      return;
    }

    if (this.editingId !== null) {
      this.customers = this.customers.map((customer) =>
        customer.id === this.editingId
          ? {
              ...customer,
              name,
              phone,
              email,
              status: this.form.status,
            }
          : customer,
      );

      this.showToast("اطلاعات مشتری ویرایش شد.");
    } else {
      this.customers.unshift({
        id: Date.now(),
        name,
        phone,
        email,
        orders: 0,
        status: this.form.status,
      });

      this.showToast("مشتری جدید اضافه شد.");
    }

    this.saveToStorage();
    this.closeModal();
  },

  deleteCustomer(id) {
    const customer = this.customers.find((item) => item.id === id);

    if (!customer) return;

    const confirmed = window.confirm(`مشتری «${customer.name}» حذف شود؟`);

    if (!confirmed) return;

    this.customers = this.customers.filter((item) => item.id !== id);

    this.saveToStorage();
    this.showToast("مشتری حذف شد.");
  },

  showToast(message) {
    this.toast = message;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toast = "";
      this.toastTimer = null;
    }, 2500);
  },
}));

window.Alpine = Alpine;
Alpine.start();
