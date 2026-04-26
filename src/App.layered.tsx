import { UserSearchPage } from "./presentation/pages/UserSearchPage";

/**
 * Application Entry Point
 * 
 * アプリケーション全体のレイアウトとルーティングを担当
 */

function App() {
  return (
    <div className="App" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <header
        style={{
          backgroundColor: "#4CAF50",
          padding: "24px 20px",
          color: "white",
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
          階層型フロントエンドアーキテクチャ
        </h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
          Layered Frontend Application Pattern
        </p>
      </header>

      <main style={{ padding: "40px 20px" }}>
        <UserSearchPage />
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#666",
          fontSize: "14px",
        }}
      >
        Presentation → Application → Domain → Infrastructure
      </footer>
    </div>
  );
}

export default App;
