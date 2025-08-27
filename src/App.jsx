import { useState } from "react";

// Week 1 and Week 2 sample flashcards (term/definition)
const flashcards = [
  // Week 1
  { term: "acronym", definition: "A word formed from the initial letter of the major parts of a compound term." },
  { term: "acute", definition: "Condition that has a rapid onset, a severe course, and a relatively short duration." },
  { term: "angiography", definition: "Process of producing an x-ray study of blood vessels after injection of a contrast medium." },
  { term: "appendectomy", definition: "Surgical removal of the appendix." },
  { term: "arteriosclerosis", definition: "Abnormal hardening of the walls of an artery or arteries." },
  // Week 2
  { term: "aden/o", definition: "Gland." },
  { term: "adip/o", definition: "Fat." },
  { term: "anter/o", definition: "Before, front." },
  { term: "caud/o", definition: "Lower part of body, tail." },
  { term: "cephal/o", definition: "Head." },
];

export default function FlashcardApp() {
  const [mode, setMode] = useState("flashcards"); // modes: flashcards, test, match
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [matches, setMatches] = useState({});

  const handleNext = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % flashcards.length);
  };

  // Simple quiz mode
  const handleAnswer = (choice) => {
    if (choice === flashcards[index].definition) {
      setScore(score + 1);
    }
    if (index + 1 === flashcards.length) {
      setTestComplete(true);
    } else {
      setIndex(index + 1);
    }
  };

  // Shuffle helper
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  // Match mode
  const [draggedTerm, setDraggedTerm] = useState(null);

  const handleDrop = (term, definition) => {
    const correctDef = flashcards.find((f) => f.term === term)?.definition;
    if (definition === correctDef) {
      setMatches({ ...matches, [term]: definition });
    }
    setDraggedTerm(null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">AP Terminology Flashcards Demo</h1>
      <div className="flex justify-center gap-2 mb-6">
        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => {setMode("flashcards"); setIndex(0);}}>Flashcards</button>
        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => {setMode("test"); setIndex(0); setScore(0); setTestComplete(false);}}>Test</button>
        <button className="px-3 py-1 bg-purple-500 text-white rounded" onClick={() => {setMode("match"); setMatches({});}}>Match</button>
      </div>

      {/* Flashcard Mode */}
      {mode === "flashcards" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <p className="text-xl font-semibold">{flashcards[index].term}</p>
          {showAnswer && <p className="mt-4 text-gray-700">{flashcards[index].definition}</p>}
          <div className="mt-6 flex justify-center gap-2">
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setShowAnswer(!showAnswer)}>
              {showAnswer ? "Hide" : "Show"} Answer
            </button>
            <button className="px-3 py-1 bg-blue-200 rounded" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {/* Test Mode */}
      {mode === "test" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          {!testComplete ? (
            <>
              <p className="text-xl font-semibold mb-4">{flashcards[index].term}</p>
              <div className="grid grid-cols-1 gap-2">
                {shuffle([...flashcards.map((f) => f.definition)]).slice(0,3).concat(flashcards[index].definition).sort(() => Math.random()-0.5).map((def, i) => (
                  <button key={i} className="px-3 py-2 border rounded hover:bg-green-100" onClick={() => handleAnswer(def)}>
                    {def}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-lg">Test Complete! Score: {score}/{flashcards.length}</p>
          )}
        </div>
      )}

      {/* Match Mode */}
      {mode === "match" && (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <p className="text-center mb-4">Drag the term to the correct definition</p>
          <p className="text-center text-sm mb-2">Progress: {Object.keys(matches).length} / {flashcards.length} matched</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {flashcards.map((f, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDraggedTerm(f.term)}
                  className={`p-2 border rounded mb-1 cursor-move ${matches[f.term] ? "bg-green-200" : "bg-gray-100"}`}
                >
                  {f.term}
                </div>
              ))}
            </div>
            <div>
              {shuffle([...flashcards.map((f) => f.definition)]).map((d, i) => (
                <div
                  key={i}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => draggedTerm && handleDrop(draggedTerm, d)}
                  className={`p-2 border rounded mb-1 min-h-[40px] ${Object.values(matches).includes(d) ? "bg-green-200" : "bg-gray-50"}`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
          {Object.keys(matches).length === flashcards.length && (
            <p className="text-center mt-4 text-green-600 font-semibold">All matches correct! 🎉</p>
          )}
        </div>
      )}
    </div>
  );
}
