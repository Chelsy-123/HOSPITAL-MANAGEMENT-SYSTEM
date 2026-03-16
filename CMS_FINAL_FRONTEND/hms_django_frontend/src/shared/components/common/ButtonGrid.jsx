const ButtonGrid = ({ actions, onAction }) => (
  <div
    style={{
      marginTop: "32px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "1.5em"
    }}
  >
    {actions.map(({ label, route }) => (
      <button
        key={route}
        style={{
          padding: "1.2em",
          fontSize: "1.08em",
          border: "none",
          borderRadius: "8px",
          background: "#286AF7",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 500,
          boxShadow: "0 2px 8px rgba(40,106,247,0.10)"
        }}
        onClick={() => onAction(route)}
      >
        {label}
      </button>
    ))}
  </div>
);

export default ButtonGrid;
