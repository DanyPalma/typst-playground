"use client";

import { useState } from "react";
import { TypstCompiler } from "@/components/TypstCompiler";
import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  const [content, setContent] = useState("");

  return (
    <main className="flex flex-row h-screen p-4 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">
        <div className="relative overflow-hidden rounded-lg border shadow-sm bg-[#1e1e1e]">
          <CodeEditor
            value={content}
            onChange={setContent}
            placeholder="Enter your math expression here..."
          />
        </div>

        <div className="overflow-auto rounded-lg border bg-white shadow-sm p-4 flex items-center justify-center min-h-[500px]">
          <div className="w-full max-w-3xl flex items-center justify-center">
            <TypstCompiler content={content} />
          </div>
        </div>
      </div>
    </main>
  );
}
