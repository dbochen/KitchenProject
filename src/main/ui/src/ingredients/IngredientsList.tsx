import { useEffect, useMemo, useState } from "react";
import './IngredientsList.scss'
import { RecipesStrings } from "../strings";
import { NetworkService } from "../NetworkService";
import { Ingredient, InventoryItem, QUANTITY_UNITS, QuantityUnit } from "../recipes/model";
import { formatUnit } from "../recipes/formatUnit";
import { Search } from "../Search";

type InventoryListItemProps = {
  item: InventoryItem
  projected: number
  onUpdate: (ingredientId: number, quantity: number, unit: QuantityUnit) => void
  onRemove: (ingredient: Ingredient) => void
  onDelete: (ingredient: Ingredient) => void
  onTogglePerishable: (ingredient: Ingredient) => void
}

const InventoryListItem = (
  { item, projected, onUpdate, onRemove, onDelete, onTogglePerishable }: InventoryListItemProps
): JSX.Element => {
  const [draftQuantity, setDraftQuantity] = useState(item.quantity)
  const flagClass = [
    "gg-flag IngredientsList-ingredients--flag",
    item.perishable ? "IngredientsList-ingredients--flag-active" : "",
  ].join(" ").trim()

  useEffect(() => {
    setDraftQuantity(item.quantity)
  }, [item.quantity])

  return (
    <div
      className="IngredientsList-ingredients--ingredient"
      data-testid={`IngredientsList-ingredients--ingredient-${item.ingredient.name}`}
    >
      <i
        className="gg-close-r"
        onClick={() => onRemove(item.ingredient)}
        data-testid={`IngredientsList-ingredients--removeIngredient-${item.ingredient.name}`}
      />
      <i
        className="gg-trash"
        onClick={() => onDelete(item.ingredient)}
        data-testid={`IngredientsList-ingredients--deleteIngredient-${item.ingredient.name}`}
      />
      <i
        className={flagClass}
        onClick={() => onTogglePerishable(item.ingredient)}
        title="Zużyj szybko"
      />
      <div className="IngredientsList-ingredients--name">{item.ingredient.name}</div>
      <input
        className="IngredientsList-ingredients--quantity"
        type="number"
        min={0}
        value={draftQuantity}
        onChange={e => setDraftQuantity(Number(e.target.value))}
        onBlur={() => onUpdate(item.ingredient.id, draftQuantity, item.unit)}
        onFocus={e => e.target.select()}
      />
      {projected !== item.quantity && (
        <span className={[
          "IngredientsList-ingredients--projected",
          projected < 0 ? "IngredientsList-ingredients--projected-negative" : "",
        ].join(" ").trim()}>
          →{Math.round(projected * 100) / 100}
        </span>
      )}
      <select
        className="IngredientsList-ingredients--unit"
        value={item.unit}
        onChange={e => onUpdate(item.ingredient.id, item.quantity, e.target.value as QuantityUnit)}
      >
        {QUANTITY_UNITS.map(unit => (
          <option value={unit} key={unit}>{formatUnit(1, unit)}</option>
        ))}
      </select>
    </div>
  )
}

type IngredientsListProps = {
  inventory: Map<number, InventoryItem>
  projectedInventory: Map<number, number>
  onAddToInventory: (ingredient: Ingredient) => void
  onRemoveFromInventory: (ingredient: Ingredient) => void
  onUpdateInventoryItem: (ingredientId: number, quantity: number, unit: QuantityUnit) => void
  onDeleteIngredient: (ingredient: Ingredient) => void
  onTogglePerishable: (ingredient: Ingredient) => void
}

const IngredientsList = ({
  inventory,
  projectedInventory,
  onAddToInventory,
  onRemoveFromInventory,
  onUpdateInventoryItem,
  onDeleteIngredient,
  onTogglePerishable,
}: IngredientsListProps): JSX.Element => {

  const { locatedGroups, ungrouped } = useMemo(() => {
    const groups: Record<string, InventoryItem[]> = {}
    const ungrouped: InventoryItem[] = []

    Array.from(inventory.values()).forEach(item => {
      const loc = item.ingredient.storageLocation
      if (loc) {
        groups[loc] = [...(groups[loc] ?? []), item]
      } else {
        ungrouped.push(item)
      }
    })

    return {
      locatedGroups: Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)),
      ungrouped,
    }
  }, [inventory])

  const renderItems = (items: InventoryItem[]) =>
    items.map(item => (
      <InventoryListItem
        key={item.ingredient.id}
        item={item}
        projected={projectedInventory.get(item.ingredient.id) ?? item.quantity}
        onUpdate={onUpdateInventoryItem}
        onRemove={onRemoveFromInventory}
        onDelete={onDeleteIngredient}
        onTogglePerishable={onTogglePerishable}
      />
    ))

  return (
    <div className="IngredientsList">
      <div className="IngredientsList-header">
        {RecipesStrings.INGREDIENTS_LIST_HEADER}
      </div>
      <Search
        onItemClick={onAddToInventory}
        getItems={NetworkService.getIngredients}
        inputPlaceholder={RecipesStrings.INGREDIENTS_SEARCH_INPUT_PLACEHOLDER}
      />
      {inventory.size > 0 && (
        <div className="IngredientsList-ingredients">
          {locatedGroups.map(([location, items]) => (
            <div key={location} className="IngredientsList-group">
              <div className="IngredientsList-group--header">{location}</div>
              {renderItems(items)}
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div className="IngredientsList-group">
              {locatedGroups.length > 0 && (
                <div className="IngredientsList-group--header">Inne</div>
              )}
              {renderItems(ungrouped)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IngredientsList
