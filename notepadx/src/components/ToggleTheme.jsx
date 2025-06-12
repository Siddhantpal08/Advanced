import { useEffect, useState } from "react";

export default function ToggleTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="text-sm text-gray-400 hover:text-white border px-2 py-1 rounded"
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
