package com.example.kitchenproject.model;

import com.example.kitchenproject.dto.RecipeOutputDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toList;

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
                .build();
    }
}
