import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Ingredient, QuantifiedIngredient, QUANTITY_UNITS, QuantityUnit, Recipe, Tag } from "./model";
import { formatUnit } from "./formatUnit";
import { Search } from "../Search";
import { NetworkService } from "../NetworkService";
import "./EditRecipeModal.scss";

type EditRecipeModalProps = {
  recipe?: Recipe;
  allTags: Tag[];
  onClose: () => void;
  onSaved: (recipe: Recipe) => void;
};

const EditRecipeModal = ({ recipe, allTags, onClose, onSaved }: EditRecipeModalProps): JSX.Element => {
  const isAddMode = recipe === undefined;

  const [name, setName] = useState<string>(recipe?.name ?? "");
  const [source, setSource] = useState<string>(recipe?.source ?? "");
  const [ingredients, setIngredients] = useState<QuantifiedIngredient[]>(recipe?.quantifiedIngredients ?? []);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(
    new Set(recipe ? allTags.filter(t => recipe.tags?.includes(t.name)).map(t => t.id) : [])
  );
  const [substitutingForId, setSubstitutingForId] = useState<number | null>(null);

  const onNameChange: ChangeEventHandler<HTMLInputElement> = (e) => setName(e.target.value);
  const onSourceChange: ChangeEventHandler<HTMLInputElement> = (e) => setSource(e.target.value);

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
      setIngredients([...ingredients, { ingredient, quantity: 0, unit: QUANTITY_UNITS[0], substitutes: [] }]);
    }
  };

  const onAddSubstitute = (qi: QuantifiedIngredient, substitute: Ingredient) => {
    if (substitute.id === qi.ingredient.id) return;
    if (qi.substitutes.find(s => s.id === substitute.id)) return;
    setIngredients(ingredients.map(i =>
      i.ingredient.id === qi.ingredient.id
        ? { ...i, substitutes: [...i.substitutes, substitute] }
        : i
    ));
    setSubstitutingForId(null);
  };

  const onRemoveSubstitute = (qi: QuantifiedIngredient, substituteId: number) => {
    setIngredients(ingredients.map(i =>
      i.ingredient.id === qi.ingredient.id
        ? { ...i, substitutes: i.substitutes.filter(s => s.id !== substituteId) }
        : i
    ));
  };

  const onTagToggle = (tag: Tag) => {
    const updated = new Set(selectedTagIds);
    updated.has(tag.id) ? updated.delete(tag.id) : updated.add(tag.id);
    setSelectedTagIds(updated);
  };

  const onSave = () => {
    const tagIds = Array.from(selectedTagIds);
    const mappedIngredients = ingredients.map(qi => ({
      id: qi.ingredient.id,
      quantity: qi.quantity,
      unit: qi.unit,
      substituteIds: qi.substitutes.map(s => s.id),
    }));

    if (!recipe) {
      NetworkService.addRecipe({ name, source, ingredients: mappedIngredients, tagIds })
        .then(newRecipe => { onSaved(newRecipe); onClose(); })
        .catch(() => alert("Wywaliło się :("));
    } else {
      NetworkService.updateRecipe(recipe.id, name, mappedIngredients, tagIds)
        .then(updatedRecipe => { onSaved(updatedRecipe); onClose(); })
        .catch(() => alert("Wywaliło się :("));
    }
  };

  return (
    <div className="EditRecipeModal-overlay" onClick={onClose}>
      <div className="EditRecipeModal" onClick={(e) => e.stopPropagation()}>
        <div className="EditRecipeModal-header">
          <input
            className="EditRecipeModal-header--nameInput"
            value={name}
            placeholder="Nazwa przepisu"
            onChange={onNameChange}
          />
          <i className="gg-close-r" onClick={onClose} />
        </div>
        {isAddMode && (
          <input
            className="EditRecipeModal-sourceInput"
            value={source}
            placeholder="Źródło przepisu"
            onChange={onSourceChange}
          />
        )}
        <div className="EditRecipeModal-ingredients">
          {ingredients.map((qi) => (
            <div className="EditRecipeModal-ingredients--ingredientWrapper" key={qi.ingredient.id}>
              <div className="EditRecipeModal-ingredients--ingredient">
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
                <button
                  className="EditRecipeModal-ingredients--addSubstituteBtn"
                  onClick={() => setSubstitutingForId(
                    substitutingForId === qi.ingredient.id ? null : qi.ingredient.id
                  )}
                  title="Dodaj zamiennik"
                >
                  ±
                </button>
              </div>
              {qi.substitutes.length > 0 && (
                <div className="EditRecipeModal-ingredients--substitutes">
                  {qi.substitutes.map(s => (
                    <span key={s.id} className="EditRecipeModal-ingredients--substitute">
                      {s.name}
                      <i className="gg-close-o" onClick={() => onRemoveSubstitute(qi, s.id)} />
                    </span>
                  ))}
                </div>
              )}
              {substitutingForId === qi.ingredient.id && (
                <Search
                  onItemClick={(sub) => onAddSubstitute(qi, sub)}
                  getItems={NetworkService.getIngredients}
                  inputPlaceholder="Szukaj zamiennika..."
                  autoFocus
                />
              )}
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
          <button className="EditRecipeModal-actions--save" onClick={onSave}>
            {isAddMode ? "Dodaj" : "Zapisz"}
          </button>
          <button className="EditRecipeModal-actions--cancel" onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export default EditRecipeModal;
