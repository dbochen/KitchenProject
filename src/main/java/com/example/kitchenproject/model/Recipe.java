package com.example.kitchenproject.model;

import com.example.kitchenproject.dto.RecipeOutputDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.HashSet;
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
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuantifiedIngredient> quantifiedIngredients;
    private String source;
    private int timeInMinutes;
    @ManyToMany
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

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
                .source(source)
                .balanceSum(quantifiedIngredients
                        .stream()
                        .reduce(
                                0,
                                (acc, qi) -> {
                                    final Balance vataBalance = qi.getIngredient().getVataBalance();
                                    if (vataBalance == null) {
                                        return acc;
                                    }
                                    return acc + vataBalance.getValue();
                                },
                                Integer::sum
                        )
                )
                .inflammationSum(quantifiedIngredients
                        .stream()
                        .reduce(
                                0,
                                (acc, qi) -> {
                                    final Inflammation inflammation = qi.getIngredient().getInflammation();
                                    if (inflammation == null) {
                                        return acc;
                                    }
                                    return acc + inflammation.ordinal() - 1;
                                },
                                Integer::sum
                        )
                )
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
            return ingredient.getCategory() == null ? 0 : servings
                    .stream()
                    .filter(serving -> serving.getUnit().equals(unit))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            String.format("Cannot find serving size for the " +
                                            "ingredient %d (%s) with category %s and unit %s (%d)",
                                    ingredient.getId(), ingredient.getName(), ingredient.getCategory(), unit,
                                    unit.ordinal()
                            )))
                    .getCategoryServing() * qi.getQuantity();
        };
    }
}
