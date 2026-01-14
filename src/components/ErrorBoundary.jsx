import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log for debugging
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            color: "#fff",
            padding: 24,
            background: "linear-gradient(180deg,#071022,#000)",
          }}
        >
          <h2>Something went wrong</h2>
          <pre style={{ maxWidth: 800, overflow: "auto", whiteSpace: "pre-wrap" }}>
            {String(this.state.error)}
          </pre>
          <div style={{ opacity: 0.85, fontSize: 14 }}>Check dev console for details.</div>
        </div>
      );
    }
    return this.props.children;
  }
}
