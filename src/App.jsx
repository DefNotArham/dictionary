import { useState } from "react";
import axios from "axios";
import { FaFileAudio } from "react-icons/fa";

function App() {
  const [theme, setTheme] = useState("light");

  const [input, setInput] = useState("");
  const [word, setWord] = useState("");
  const [def, setDef] = useState("");
  const [example, setExample] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [audio, setAudio] = useState("");

  const [synonyms, setSynonyms] = useState([]);
  const [antonyms, setAntonyms] = useState([]);

  const [error, setError] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const playAudio = () => {
    if (!audio) return setError("No audio available");

    if (audio) {
      const url = audio.startsWith("http") ? audio : `https:${audio}`;
      new Audio(url).play();
    }
  };

  const handleSearch = async () => {
    setError("");
    try {
      const res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${input}`,
      );

      const data = res.data[0];

      setWord(res.data[0].word);
      setDef(
        data.meanings[0]?.definitions[0]?.definition || "No definition found",
      );
      setExample(
        data.meanings[0]?.definitions[0]?.example || "No example available",
      );
      setPhonetic(data.phonetics[0]?.text || "No phonetic available");

      setSynonyms(data.meanings[0]?.definitions[0]?.synonyms || []);
      setAntonyms(data.meanings[0]?.definitions[0]?.antonyms || []);

      setAudio(data.phonetics[0]?.audio);
    } catch (error) {
      console.log(error);
      setError("Word not found. Try another one");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div
        className={` min-h-screen  flex items-center justify-center ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}
      >
        <div
          className={`p-10 rounded-3xl ${theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
        >
          <div className="flex justify-end">
            <button
              onClick={toggleTheme}
              className={`px-3 py-2 rounded-md text-sm mb-4 ${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              } cursor-pointer`}
            >
              Toggle {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
          <div className="flex flex-col text-center">
            <h1 className="text-3xl font-bold">📖 Get word definition</h1>

            <div className="mt-3 flex flex-col gap-3 items-center">
              <input
                className="border border-gray-500 p-2 rounded-xl w-90 text-sm"
                placeholder="Search a word..."
                type="text"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={handleEnter}
              />
              <button
                onClick={handleSearch}
                className={`text-sm  px-5 py-2.5 rounded-xl cursor-pointer ${
                  theme === "light"
                    ? "border border-gray-400 text-white bg-indigo-500"
                    : "border border-gray-600 bg-indigo-400 text-white"
                }`}
              >
                Search
              </button>
              {error && <p className="text-red-500 ">{error}</p>}
            </div>
          </div>

          <div className="mt-10 max-w-md">
            <h1 className="text-3xl font-bold">{word ? word : "Word"}</h1>
            <div className="flex items-center gap-2">
              <p
                className={
                  theme === "light" ? "text-gray-500" : "text-gray-400 mt-2"
                }
              >
                {phonetic ? phonetic : "/wɜːd/"}
              </p>
              <FaFileAudio
                size="20px"
                className="cursor-pointer"
                onClick={playAudio}
              />
            </div>

            <div className="mt-3">
              <p
                className={`font-bold ${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm mb-2`}
              >
                Definition
              </p>
              <p className="leading-tight font-semibold break-words whitespace-normal">
                {def ? def : "This is where the definition will appear."}
              </p>
            </div>

            <div className="mt-3 max-w-md">
              <p
                className={`font-bold ${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm mb-2`}
              >
                Example
              </p>
              <p className="leading-tight font-semibold break-words whitespace-normal">
                {example ? example : `"This is an example sentence."`}
              </p>
            </div>

            <div className="mt-4">
              <p
                className={`font-bold ${theme === "light" ? "text-gray-500" : "text-gray-400"} mb-2 `}
              >
                Synonyms:{" "}
                <span
                  className={`${theme === "light" ? "text-black" : "text-white"}`}
                >
                  {" "}
                  {synonyms.length > 0 ? synonyms.join(", ") : "None"}
                </span>
              </p>
              <p
                className={`font-bold  ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
              >
                Antonyms:{" "}
                <span
                  className={`${theme === "light" ? "text-black" : "text-white"}`}
                >
                  {antonyms.length > 0 ? antonyms.join(", ") : "None"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
