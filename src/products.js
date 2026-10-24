import Alpine from 'alpinejs';

Alpine.data('productsPage', () => ({
  dark: true,
  sidebarOpen: false,
  modalOpen: false,
  search: '',
  category: 'all',
  sortBy: 'newest',
  editingId: null,
  notice: '',
  noticeTimeout: null,

  categories: ['موبایل', 'لپ‌تاپ', 'لوازم جانبی', 'هدفون'],

  products: [
    {
      id: 1,
      name: 'آیفون ۱۵ پرو',
      brand: 'Apple',
      category: 'موبایل',
      price: 75000000,
      stock: 24,
      icon: '📱',
    },
    {
      id: 2,
      name: 'MacBook Air M3',
      brand: 'Apple',
      category: 'لپ‌تاپ',
      price: 92000000,
      stock: 12,
      icon: '💻',
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      brand: 'Apple',
      category: 'لوازم جانبی',
      price: 9800000,
      stock: 3,
      icon: '🎧',
    },
  ],

  form: {
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
  },

  init() {
    this.dark = (localStorage.getItem('theme') || 'dark') === 'dark';
    this.applyTheme();

    try {
      const saved = JSON.parse(
        localStorage.getItem('panelProducts') || 'null'
      );

      if (Array.isArray(saved)) {
        this.products = saved;
      }
    } catch (error) {
      console.warn('ذخیره محصولات قابل خواندن نبود.', error);
    }
  },

  get filteredProducts() {
    const query = this.search.toLocaleLowerCase('fa');

    const list = this.products.filter((product) => {
      const text = `${product.name} ${product.brand}`
        .toLocaleLowerCase('fa');

      const matchesSearch = !query || text.includes(query);

      const matchesCategory =
        this.category === 'all' ||
        product.category === this.category;

      return matchesSearch && matchesCategory;
    });

    if (this.sortBy === 'priceAsc') {
      list.sort((a, b) => a.price - b.price);
    }

    if (this.sortBy === 'priceDesc') {
      list.sort((a, b) => b.price - a.price);
    }

    if (this.sortBy === 'stockAsc') {
      list.sort((a, b) => a.stock - b.stock);
    }

    if (this.sortBy === 'newest') {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  },

  toggleTheme() {
    this.dark = !this.dark;

    localStorage.setItem(
      'theme',
      this.dark ? 'dark' : 'light'
    );

    this.applyTheme();
  },

  applyTheme() {
    document.documentElement.classList.toggle(
      'dark',
      this.dark
    );

    document.documentElement.classList.toggle(
      'light',
      !this.dark
    );
  },

  formatPrice(value) {
    return Number(value || 0).toLocaleString('fa-IR');
  },

  resetForm() {
    this.form = {
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: '',
    };

    this.editingId = null;
  },

  openAddModal() {
    this.resetForm();
    this.modalOpen = true;

    this.$nextTick(() => {
      document.getElementById('productName')?.focus();
    });
  },

  editProduct(product) {
    this.editingId = product.id;

    this.form = {
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      stock: product.stock,
    };

    this.modalOpen = true;

    this.$nextTick(() => {
      document.getElementById('productName')?.focus();
    });
  },

  closeModal() {
    this.modalOpen = false;
    this.resetForm();
  },

  saveProduct() {
    const price = Number(this.form.price);
    const stock = Number(this.form.stock);

    if (
      !this.form.name.trim() ||
      !this.form.brand.trim() ||
      !this.form.category ||
      this.form.price === '' ||
      this.form.stock === '' ||
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      price < 0 ||
      stock < 0
    ) {
      this.showNotice('لطفاً اطلاعات محصول را درست وارد کنید.');
      return;
    }

    const product = {
      id:
        this.editingId ??
        this.products.reduce(
          (max, item) => Math.max(max, item.id),
          0
        ) + 1,

      name: this.form.name.trim(),
      brand: this.form.brand.trim(),
      category: this.form.category,
      price,
      stock: Math.floor(stock),

      icon:
        this.form.category === 'لپ‌تاپ'
          ? '💻'
          : this.form.category === 'هدفون'
            ? '🎧'
            : this.form.category === 'لوازم جانبی'
              ? '🎧'
              : '📱',
    };

    if (this.editingId !== null) {
      this.products = this.products.map((item) =>
        item.id === this.editingId
          ? { ...item, ...product }
          : item
      );

      this.showNotice('تغییرات محصول ذخیره شد.');
    } else {
      this.products = [product, ...this.products];

      this.showNotice('محصول جدید اضافه شد.');
    }

    this.persist();
    this.closeModal();
  },

  removeProduct(id) {
    const product = this.products.find(
      (item) => item.id === id
    );

    if (!product) return;

    const confirmed = window.confirm(
      `محصول «${product.name}» حذف شود؟`
    );

    if (!confirmed) return;

    this.products = this.products.filter(
      (item) => item.id !== id
    );

    this.persist();
    this.showNotice('محصول حذف شد.');
  },

  persist() {
    try {
      localStorage.setItem(
        'panelProducts',
        JSON.stringify(this.products)
      );
    } catch (error) {
      this.showNotice('ذخیره‌سازی مرورگر در دسترس نیست.');
    }
  },

  showNotice(message) {
    this.notice = message;

    window.clearTimeout(this.noticeTimeout);

    this.noticeTimeout = window.setTimeout(() => {
      this.notice = '';
    }, 2800);
  },
}));

window.Alpine = Alpine;
Alpine.start();