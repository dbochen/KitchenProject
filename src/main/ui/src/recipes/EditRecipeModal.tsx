import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Ingredient, QuantifiedIngredient, QUANTITY_UNITS, QuantityUnit, Recipe, Tag } from "./model";
import { formatUnit } from "./formatUnit";
import { Search } from "../Search";
import { NetworkService } from "../NetworkService";
import "./EditRecipeModal.scss";

type EditRecipeModalProps = {
  recipe: Recipe;
  allTags: Tag[];
  onClose: () => void;
  onSaved: (updatedRecipe: Recipe) => void;
};

const EditRecipeModal = ({ recipe, allTags, onClose, onSaved }: EditRecipeModalProps): JSX.Element => {
  const [name, setName] = useState<string>(recipe.name);
  const [ingredients, setIngredients] = useState<QuantifiedIngredient[]>(recipe.quantifiedIngredients);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(
    new Set(allTags.filter(t => recipe.tags?.includes(t.name)).map(t => t.id))
  );

  const onNameChange: ChangeEventHandler<HTMLInputElement> = (e) => setName(e.target.value);

  const onRemoveIngredient = (qi: QuantifiedIngredient) => {
    setIngredients(ingredients.filter(i => i.ingredient.id !== qi.ingredient.id));
  };

  const onQuantityChange = (event: ChangeEvent<HTMLInputElement>, qi: QuantifiedIngredient) => {
    setIngredients(ingredients.map(i =>
      i.ingredient.id === qi.ingredient.id ? { ...i, quantity: Number(event.target.value) } : i
    ));
  };

  const onUnitChange = (event: ChangeEvent<HTMLSelectElement>, qi: QuantifiedIngredient) => {
    setIngredients(ingredients.map(i =>
      i.ingredient.id === qi.ingredient.id ? { ...i, unit: event.target.value as QuantityUnit } : i
    ));
  };

  const onAddIngredient = (ingredient: Ingredient) => {
    if (!ingredients.find(i => i.ingredient.id === ingredient.id)) {
      setIngredients([...ingredients, { ingredient, quantity: 0, unit: QUANTITY_UNITS[0] }]);
    }
  };

  const onTagToggle = (tag: Tag) => {
    const updated = new Set(selectedTagIds);
    updated.has(tag.id) ? updated.delete(tag.id) : updated.add(tag.id);
    setSelectedTagIds(updated);
  };

  const onSave = () => {
    NetworkService.updateRecipe(
      recipe.id,
      name,
      ingredients.map((qi) => ({
        id: qi.ingredient.id,
        quantity: qi.quantity,
        unit: qi.unit,
      })),
      Array.from(selectedTagIds)
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
          {ingredients.map((qi) => (
            <div className="EditRecipeModal-ingredients--ingredient" key={qi.ingredient.id}>
              <i className="gg-close-r" onClick={() => onRemoveIngredient(qi)} />
              <div className="EditRecipeModal-ingredients--name">{qi.ingredient.name}</div>
              <input
                type="number"
                value={qi.quantity}
                onChange={(e) => onQuantityChange(e, qi)}
                onFocus={(e) => e.target.select()}
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
        {allTags.length > 0 && (
          <div className="EditRecipeModal-tags">
            {allTags.map(tag => (
              <div
                key={tag.id}
                className={`EditRecipeModal-tags--chip${
                  selectedTagIds.has(tag.id) ? " EditRecipeModal-tags--chip-selected" : ""
                }`}
                onClick={() => onTagToggle(tag)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
        <div className="EditRecipeModal-actions">
          <button className="EditRecipeModal-actions--save" onClick={onSave}>Zapisz</button>
          <button className="EditRecipeModal-actions--cancel" onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipeModal;
