import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Ingredient, QuantifiedIngredient, QUANTITY_UNITS, QuantityUnit, Recipe } from "./model";
import { formatUnit } from "./formatUnit";
import { Search } from "../Search";
import { NetworkService } from "../NetworkService";
import "./EditRecipeModal.scss";

type EditRecipeModalProps = {
  recipe: Recipe;
  onClose: () => void;
  onSaved: (updatedRecipe: Recipe) => void;
};

const EditRecipeModal = ({ recipe, onClose, onSaved }: EditRecipeModalProps): JSX.Element => {
  const [name, setName] = useState<string>(recipe.name);
  const [ingredients, setIngredients] = useState<Record<number, QuantifiedIngredient>>(
    recipe.quantifiedIngredients.reduce<Record<number, QuantifiedIngredient>>(
      (acc, qi) => ({ ...acc, [qi.ingredient.id]: qi }),
      {}
    )
  );

  const onNameChange: ChangeEventHandler<HTMLInputElement> = (e) => setName(e.target.value);

  const onRemoveIngredient = (qi: QuantifiedIngredient) => {
    const updated = { ...ingredients };
    delete updated[qi.ingredient.id];
    setIngredients(updated);
  };

  const onQuantityChange = (event: ChangeEvent<HTMLInputElement>, qi: QuantifiedIngredient) => {
    setIngredients({
      ...ingredients,
      [qi.ingredient.id]: { ...qi, quantity: Number(event.target.value) },
    });
  };

  const onUnitChange = (event: ChangeEvent<HTMLSelectElement>, qi: QuantifiedIngredient) => {
    setIngredients({
      ...ingredients,
      [qi.ingredient.id]: { ...qi, unit: event.target.value as QuantityUnit },
    });
  };

  const onAddIngredient = (ingredient: Ingredient) => {
    if (!ingredients[ingredient.id]) {
      setIngredients({
        ...ingredients,
        [ingredient.id]: { ingredient, quantity: 0, unit: QUANTITY_UNITS[0] },
      });
    }
  };

  const onSave = () => {
    NetworkService.updateRecipe(
      recipe.id,
      name,
      Object.values(ingredients).map((qi) => ({
        id: qi.ingredient.id,
        quantity: qi.quantity,
        unit: qi.unit,
      }))
    )
      .then((updatedRecipe) => {
        onSaved(updatedRecipe);
        onClose();
      })
      .catch(() => alert("Wywaliło się :("));
  };

  return (
    <div className="EditRecipeModal-overlay" onClick={onClose}>
      <div className="EditRecipeModal" onClick={(e) => e.stopPropagation()}>
        <div className="EditRecipeModal-header">
          <input
            className="EditRecipeModal-header--nameInput"
            value={name}
            onChange={onNameChange}
          />
          <i className="gg-close-r" onClick={onClose} />
        </div>
        <div className="EditRecipeModal-ingredients">
          {Object.values(ingredients).map((qi) => (
            <div className="EditRecipeModal-ingredients--ingredient" key={qi.ingredient.id}>
              <i className="gg-close-r" onClick={() => onRemoveIngredient(qi)} />
              <div className="EditRecipeModal-ingredients--name">{qi.ingredient.name}</div>
              <input
                type="number"
                value={qi.quantity}
                onChange={(e) => onQuantityChange(e, qi)}
              />
              <select value={qi.unit} onChange={(e) => onUnitChange(e, qi)}>
                {QUANTITY_UNITS.map((unit) => (
                  <option value={unit} key={unit}>{formatUnit(qi.quantity, unit)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <Search
          onItemClick={onAddIngredient}
          getItems={NetworkService.getIngredients}
          inputPlaceholder="Dodaj składnik..."
        />
        <div className="EditRecipeModal-actions">
          <button className="EditRecipeModal-actions--save" onClick={onSave}>Zapisz</button>
          <button className="EditRecipeModal-actions--cancel" onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipeModal;