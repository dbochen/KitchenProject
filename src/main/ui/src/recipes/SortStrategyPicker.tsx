import "./SortStrategyPicker.scss";

export type SortStrategy = "standard" | "ingredients" | "balance" | "inflammation" | "servings" | "random";

type SortStrategyPickerProps = {
  selected: SortStrategy;
  onChange: (strategy: SortStrategy) => void;
};

const STRATEGIES: { value: SortStrategy; label: string }[] = [
  { value: "standard", label: "Standardowe" },
  { value: "ingredients", label: "Składniki" },
  { value: "balance", label: "Balans" },
  { value: "inflammation", label: "Zapalenie" },
  { value: "servings", label: "Greger" },
  { value: "random", label: "Losowo" },
];

const SortStrategyPicker = ({ selected, onChange }: SortStrategyPickerProps): JSX.Element => (
  <div className="SortStrategyPicker">
    {STRATEGIES.map(({ value, label }) => (
      <div
        key={value}
        className={`SortStrategyPicker-chip${selected === value ? " SortStrategyPicker-chip--selected" : ""}`}
        onClick={() => onChange(value)}
      >
        {label}
      </div>
    ))}
  </div>
);

export default SortStrategyPicker;
