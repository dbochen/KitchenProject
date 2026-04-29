import "./Menu.scss"

const CATEGORY_LABELS: Record<string, string> = {
  OTHER_VEGETABLES: "Inne warzywa",
  NUTS_AND_SEEDS: "Orzechy i nasiona",
  GREENS: "Zielone liście",
  BEANS: "Strączki",
  OTHER_FRUITS: "Inne owoce",
  WHOLE_GRAINS: "Pełne ziarna",
  BERRIES: "Jagody",
  CRUCIFEROUS_VEGETABLES: "Warzywa krzyżowe",
  FLAXSEED: "Siemię lniane",
}

type Props = {
  categories: { category: string, total: number, required: number, percentage: number }[]
}

export const Menu = ({ categories }: Props) => (
  <div className="Menu">
    <div className="Menu-header">Codzienny tuzin</div>
    {categories.map(({ category, total, required, percentage }) => (
      <div key={category} className="Menu-row">
        <div className="Menu-row--label">{CATEGORY_LABELS[category] ?? category}</div>
        <div className="Menu-row--track">
          <div
            className={`Menu-row--fill${percentage >= 1 ? " Menu-row--fill-complete" : ""}`}
            style={{ width: `${Math.min(percentage * 100, 100)}%` }}
          />
        </div>
        <div className="Menu-row--count">{total}/{required}</div>
      </div>
    ))}
  </div>
)
