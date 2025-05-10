"use client";

import type React from "react";
import { useRef, useEffect } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Update line numbers when content changes
  useEffect(() => {
    if (lineNumbersRef.current) {
      const lineCount = (value.match(/\n/g) || []).length + 1;
      const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)
        .map((num) => `<div class="line-number">${num}</div>`)
        .join("");

      lineNumbersRef.current.innerHTML = lineNumbers;
    }
  }, [value]);

  // Sync scroll between textarea and line numbers
  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (!textarea || !lineNumbers) return;

    const handleScroll = () => {
      if (lineNumbers) {
        lineNumbers.scrollTop = textarea.scrollTop;
      }
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;

      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex h-full text-sm">
      <div
        ref={lineNumbersRef}
        className="line-numbers flex-none w-12 py-4 text-right pr-2 text-gray-500 bg-[#252526] overflow-hidden"
        aria-hidden="true"
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-grow p-4 pl-3 bg-[#1e1e1e] text-gray-200 font-mono resize-none focus:outline-none focus:ring-0 border-0"
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;
