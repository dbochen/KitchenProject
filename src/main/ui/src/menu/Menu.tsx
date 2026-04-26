import classNames from "classnames";
import "./Menu.scss"

type Props = {
  categories: { category: string, total: number, required: number, percentage: number }[]
}

export const Menu = ({ categories }: Props) => {

  const categoryClassNames = (percentage: number) => classNames(
    "Menu-category",
    { "Menu-category--complete": percentage >= 1 },
    { "Menu-category--partial": percentage < 1 && percentage >= 0.5 },
    { "Menu-category--missing": percentage < 0.5 },
  )

  return (
    <div className={"Menu"}>
      Menu
      {categories.map(
        ({ category, total, required, percentage }) => (
          <div key={category} className={categoryClassNames(percentage)}>{`${category}: ${total} / ${required}`}</div>
        )
      )}
    </div>
  )
}
