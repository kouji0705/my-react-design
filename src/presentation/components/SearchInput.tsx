/**
 * Presentation Layer - Pure Component
 * 
 * UIの一部を表示する純粋なコンポーネント
 * ステートを持たず、propsのみに依存
 */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "検索...",
}: SearchInputProps) => {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        marginBottom: "20px",
        padding: "12px",
        width: "100%",
        fontSize: "16px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#4CAF50";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e0e0e0";
      }}
    />
  );
};
