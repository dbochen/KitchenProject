package com.example.kitchenproject.model;

import com.example.kitchenproject.dto.RecipeOutputDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

@Data
@AllArgsConstructor
@Builder
@Entity
@NoArgsConstructor
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    @OneToMany(cascade = CascadeType.ALL)
    private List<QuantifiedIngredient> quantifiedIngredients;
    private String source;
    private int timeInMinutes;
    @ManyToMany
    private Set<Tag> tags;

    public RecipeOutputDto toRecipeOutputDto() {
        return RecipeOutputDto.builder()
                .name(name)
                .tags(tags.stream().map(Tag::getName).collect(toList()))
                .id(id)
                .quantifiedIngredients(quantifiedIngredients
                        .stream()
                        .map(QuantifiedIngredient::toOutputDto)
                        .collect(toList())
                )
                .categoryServings(getCategoryServings())
                .build();
    }

    private Map<Category, Double> getCategoryServings() {
        return quantifiedIngredients.stream()
                .filter(qi -> qi.getIngredient().getCategory() != null)
                .collect(toMap(
                        qi -> qi.getIngredient().getCategory(),
                        getServingsPerCategory(),
                        Double::sum
                ));
    }

    private Function<QuantifiedIngredient, Double> getServingsPerCategory() {
        return qi -> {
            final Ingredient ingredient = qi.getIngredient();
            final List<Serving> servings = ingredient.getServings();
            final QuantityUnit unit = qi.getUnit();
            return servings.isEmpty() ? 0 : servings
                    .stream()
                    .filter(serving -> serving.getUnit().equals(unit))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            String.format("Cannot find serving size for the " +
                                            "ingredient %d with category %s and unit %s",
                                    id, ingredient.getCategory(), unit
                            )))
                    .getCategoryServing() * qi.getQuantity();
        };
    }
}
