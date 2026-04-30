import { Ingredient, QuantityUnit } from "../recipes/model";
import { formatUnit } from "../recipes/formatUnit";
import "./ShoppingList.scss";

export type ShoppingListDeficit = {
  ingredient: Ingredient
  deficit: number
  unit: QuantityUnit
}

export type ShoppingListMismatch = {
  ingredient: Ingredient
  inventoryUnit: QuantityUnit
  recipeUnit: QuantityUnit
}

type ShoppingListProps = {
  deficits: ShoppingListDeficit[]
  mismatches: ShoppingListMismatch[]
}

const ShoppingList = ({ deficits, mismatches }: ShoppingListProps): JSX.Element | null => {
  if (deficits.length === 0 && mismatches.length === 0) return null

  return (
    <div className="ShoppingList">
      <div className="ShoppingList-header">Lista zakupów</div>
      {deficits.map(({ ingredient, deficit, unit }) => (
        <div key={ingredient.id} className="ShoppingList-item">
          <span className="ShoppingList-item--name">{ingredient.name}</span>
          <span className="ShoppingList-item--amount">
            {Math.round(deficit * 100) / 100} {formatUnit(deficit, unit)}
          </span>
        </div>
      ))}
      {mismatches.length > 0 && (
        <>
          <div className="ShoppingList-mismatches-header">Niezgodności jednostek:</div>
          {mismatches.map(({ ingredient, inventoryUnit, recipeUnit }) => (
            <div key={ingredient.id} className="ShoppingList-item ShoppingList-item--mismatch">
              <span className="ShoppingList-item--name">{ingredient.name}</span>
              <span className="ShoppingList-item--mismatch-info">
                inwentarz: {formatUnit(1, inventoryUnit)}, przepis: {formatUnit(1, recipeUnit)}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default ShoppingList
