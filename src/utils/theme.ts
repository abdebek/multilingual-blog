// Theme utility functions
export function getInitialTheme(): "light" | "dark" {
  if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  }
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function setTheme(theme: "light" | "dark") {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", theme);
  }
  
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
}
