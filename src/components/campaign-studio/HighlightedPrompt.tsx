// Render de un prompt generado con resaltado ligero de "sintaxis".
// Extraído sin cambios desde SocialLab.tsx:128-145.
export function HighlightedPrompt({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => {
        const trimmed = line.trim();
        const isHeader = /^[A-Z][A-Z0-9 &/]*:?\s*$/.test(trimmed) && trimmed.length > 1;
        const isMeta = /^==.*==$/.test(trimmed);
        if (isMeta) {
          return <div key={i} className="text-emerald-500/70 font-bold tracking-widest">{line || ' '}</div>;
        }
        if (isHeader) {
          return <div key={i} className="text-emerald-400 font-bold tracking-wide mt-2 first:mt-0">{line}</div>;
        }
        return <div key={i} className="text-zinc-300">{line || ' '}</div>;
      })}
    </>
  );
}
