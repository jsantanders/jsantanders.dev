import { useEffect, useState } from "react";

import { useI18n } from "next-localization";

import { DarkModeSwitch } from "@/ui/DarkModeSwitch";

const QUERY = "(prefers-color-scheme: dark)";

/**
 * Toggle between light and dark theme.
 * @returns {React.ReactElement} React component
 */
const ThemeButton: React.FC = () => {
  const i18n = useI18n();
  const [theme, setTheme] = useState(() => {
    return document.body.classList.item(0) as string;
  });

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.replace("light", "dark");
    } else {
      document.body.classList.replace("dark", "light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    // eslint-disable-next-line require-jsdoc
    const handleChange = () => setTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <button
      className="mr-2 rounded-xl px-2 py-2 hover:bg-secondary focus:outline-none focus-visible:bg-secondary focus-visible:ring-2 active:bg-tertiary md:mr-4"
      type="button"
      aria-label={i18n.t("nav.theme")}
      title={i18n.t("nav.theme")}
      onClick={() => setTheme((theme) => (theme === "light" ? "dark" : "light"))}
    >
      <DarkModeSwitch checked={theme === "dark"} />
    </button>
  );
};

export default ThemeButton;
