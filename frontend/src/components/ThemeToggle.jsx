import { Moon, SunMedium } from "lucide-react";
import Button from "./Button";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggleTheme}
      className="h-11 w-11 rounded-2xl px-0"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
    </Button>
  );
}
