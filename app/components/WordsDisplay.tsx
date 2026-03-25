"use client";

interface Phrase {
  text: string;
  start: number;
  end: number;
}

interface WordsDisplayProps {
  phrases: Phrase[];
  currentPhraseIndex: number;
}

export default function WordsDisplay({
  phrases,
  currentPhraseIndex,
}: WordsDisplayProps) {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center px-8 relative">
      <div className="relative w-full max-w-5xl">
        {phrases.map((phrase, index) => {
          const isActive = index === currentPhraseIndex;

          return (
            <div
              key={index}
              className={`absolute inset-0 flex items-center transition-all duration-300 text-4xl md:text-6xl font-bold text-[#283618] font-display leading-[0.95] ${
                isActive
                  ? "opacity-100 blur-0"
                  : "opacity-0 blur-md pointer-events-none"
              }`}
            >
              {phrase.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
