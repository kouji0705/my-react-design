import { UserSearch } from "./components/UserSearch";

function App() {
  return (
    <div className="App">
      {/* App.tsxは全体のレイアウトや、将来的なルーティング（React Router等）を受け持ちます。
        具体的なビジネスロジックや検索の仕組みは、すべて下のUserSearchの中に隠蔽されています。
      */}
      <header style={{ backgroundColor: "#282c34", padding: "20px", color: "white", textAlign: "center" }}>
        <h1>React Architecture Study</h1>
      </header>

      <main style={{ padding: "20px" }}>
        <UserSearch />
      </main>
    </div>
  );
}

export default App;