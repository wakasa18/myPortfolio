/** Slow toolkit ticker. The second group is a hidden duplicate that makes the loop seamless. */
export function ToolMarquee({ tools }: { tools: readonly (readonly [string, string])[] }) {
  return <div className="tool-marquee">
    <div className="tool-marquee-track">
      {[0, 1].map(copy => <ul key={copy} className="tool-marquee-group" aria-hidden={copy === 1 ? true : undefined} aria-label={copy === 0 ? "Development toolkit" : undefined}>
        {tools.map(([abbr, name]) => <li key={name}><b className="tool-abbr" aria-hidden="true">{abbr}</b>{name}</li>)}
      </ul>)}
    </div>
  </div>;
}
