import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "./Icons";
import "./index.css";

export default function App() {
  const [input, setInput] = useState("😊");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [themeMode, setThemeMode] = useState("light");

  // Load theme from localStorage and set class
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const html = document.documentElement;
    html.classList.remove("light", "dark");

    if (storedTheme) {
      setThemeMode(storedTheme);
      html.classList.add(storedTheme);
    } else {
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(themeMode);
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const getMoodFromInput = async (prompt) => {
    const res = await fetch("http://localhost:5000/api/flan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.output;
  };

  const fetchImages = async (query) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=6&client_id=${import.meta.env.VITE_UNSPLASH_KEY}`
      );
      const data = await res.json();
      return data.results?.map((img) => img.urls.regular) || [];
    } catch (err) {
      console.error("Image fetch error:", err);
      return [];
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const moodKeyword = await getMoodFromInput(input);
      const imgs = await fetchImages(moodKeyword);
      setImages(imgs);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-8 mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mood Board</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            aria-label="Toggle theme"
          >
            {themeMode === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <div className="p-6 mb-8 rounded-lg bg-white dark:bg-gray-800 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-grow">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter emoji or mood
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="😊 happy, 🌊 calm, 🔥 energetic..."
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className={`px-6 py-3 font-medium text-white rounded-lg bg-purple-600 hover:bg-purple-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Loading..." : "Generate"}
            </button>
          </div>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Mood ${idx}`}
                className="object-cover w-full h-48 rounded-lg shadow-md"
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 dark:text-gray-300 mt-8">
            Your mood board is empty.
          </div>
        )}
      </div>
    </div>
  );
}
