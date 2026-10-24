document.addEventListener("alpine:init", () => {
  Alpine.data("themeManager", () => ({
    dark: localStorage.getItem("theme") !== "light",

    init() {
      this.applyTheme();
    },

    toggleTheme() {
      this.dark = !this.dark;

      localStorage.setItem("theme", this.dark ? "dark" : "light");

      this.applyTheme();
    },

    applyTheme() {
      document.documentElement.classList.toggle("dark", this.dark);
    },
  }));
});
