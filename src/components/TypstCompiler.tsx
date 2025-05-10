"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    $typst: {
      svg: (options: { mainContent: string }) => Promise<string>;
      pdf: (options: { mainContent: string }) => Promise<Uint8Array>;
      setCompilerInitOptions: (options: { getModule: () => string }) => void;
      setRendererInitOptions: (options: { getModule: () => string }) => void;
    };
  }
}

interface TypstCompilerProps {
  content: string;
  onError?: (error: Error) => void;
}

export function TypstCompiler({ content, onError }: TypstCompilerProps) {
  const [svg, setSvg] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Loading Typst script...");
    // Load the script
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js";
    script.id = "typst";

    script.addEventListener("load", () => {
      console.log("Script loaded, initializing Typst...");
      window.$typst.setCompilerInitOptions({
        getModule: () =>
          "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm",
      });
      window.$typst.setRendererInitOptions({
        getModule: () =>
          "https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm",
      });
      console.log("Typst initialized");
      setIsLoaded(true);
    });

    script.addEventListener("error", () => {
      const errorMessage = "Failed to load Typst script";
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    });

    document.head.appendChild(script);

    return () => {
      console.log("Cleaning up Typst script...");
      document.head.removeChild(script);
    };
  }, [onError]);

  useEffect(() => {
    if (!isLoaded) return;

    const previewSvg = async () => {
      try {
        setError(null);
        console.log("Compiling Typst content...");
        // Wrap the content in math delimiters if it's not already wrapped
        const wrappedContent = content.trim().startsWith("$")
          ? content
          : `$ ${content} $`;
        const result = await window.$typst.svg({ mainContent: wrappedContent });
        console.log("Compilation successful, SVG length:", result.length);
        setSvg(result);
      } catch (error) {
        // Parse the error message to get the actual Typst error
        const errorStr = error instanceof Error ? error.message : String(error);
        const match = errorStr.match(/message: "([^"]+)"/);
        const errorMessage = match ? match[1] : "Compilation failed";
        setError(errorMessage);
        onError?.(error as Error);
      }
    };

    previewSvg();
  }, [content, isLoaded, onError]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-mono text-sm">
        {error}
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
