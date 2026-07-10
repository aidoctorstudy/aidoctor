// Brand mark for AI Doctor — a neural "mind" node-graph inside a head ring.
// (Vector recreation of the uploaded neural-head logo concept, cyan -> emerald.)
export default function LogoMark({ className = "h-9 w-9" }) {
  const nodes = [
    [24, 9], [14, 16], [34, 15], [10, 27],
    [24, 24], [37, 28], [17, 37], [32, 37],
  ];
  const edges = [
    [0, 1], [0, 2], [1, 4], [2, 4], [1, 3],
    [4, 5], [2, 5], [3, 6], [4, 6], [4, 7], [5, 7], [6, 7],
  ];
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-label="AI Doctor">
      <defs>
        <linearGradient id="aid-grad" x1="6" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* head / mind ring */}
      <path
        d="M24 3.5c-9.5 0-16.5 7-16.5 16 0 4.4 1.6 7.9 4.4 11 1.2 1.3 1.7 2.4 1.7 4.2V41"
        stroke="url(#aid-grad)" strokeWidth="2.4" strokeLinecap="round" opacity="0.9"
      />
      <path
        d="M40.5 19.5c0 5.2-2.3 9.2-6 12"
        stroke="url(#aid-grad)" strokeWidth="2.4" strokeLinecap="round" opacity="0.55"
      />
      {/* synapses */}
      <g stroke="url(#aid-grad)" strokeWidth="1.4" opacity="0.6">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      {/* neurons */}
      <g fill="url(#aid-grad)">
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 4 ? 2.6 : 1.9} />
        ))}
      </g>
    </svg>
  );
}
