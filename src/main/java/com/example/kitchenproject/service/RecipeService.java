package com.example.kitchenproject.service;

import com.example.kitchenproject.dto.RecipeInputDto;
import com.example.kitchenproject.dto.RecipeOutputDto;
import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.QuantifiedIngredient;
import com.example.kitchenproject.model.Recipe;
import com.example.kitchenproject.model.Tag;
import com.example.kitchenproject.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(@Autowired RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public List<Recipe> getAllRecipes(String sort, String tagsString) {
        List<Integer> ids = Arrays.stream(sort.split(","))
                .filter(id -> !id.equals(""))
                .map(Integer::parseInt)
                .collect(toList());

        Set<Integer> tagIds = Arrays.stream(tagsString.split(","))
                .filter(id -> !id.equals(""))
                .map(Integer::parseInt)
                .collect(toSet());

        Map<Recipe, Double> result = new HashMap<>();

        final List<Recipe> recipes = recipeRepository
                .findAll()
                .stream()
                .filter(recipe -> {
                    final Set<Integer> recipeTags = recipe.getTags().stream().map(Tag::getId).collect(toSet());
                    recipeTags.retainAll(tagIds);
                    return !recipeTags.isEmpty();
                })
                .collect(toList());

        for (Recipe recipe : recipes) {
            List<Integer> ingredientsFromRecipes = recipe.getQuantifiedIngredients()
                    .stream()
                    .map(QuantifiedIngredient::getIngredient)
                    .map(Ingredient::getId)
                    .collect(toList());
            double appearanceCount = 0;

            for (Integer id : ids) {
                if (ingredientsFromRecipes.contains(id)) {
                    appearanceCount++;
                }
            }

            result.put(recipe, appearanceCount / ingredientsFromRecipes.size());

        }

        List<Map.Entry<Recipe, Double>> entries = new ArrayList<>(result.entrySet());

        return entries.stream()
                .sorted(Comparator.comparingDouble(entry -> -entry.getValue()))
                .map(Map.Entry::getKey)
                .collect(toList());
    }

    public Recipe save(RecipeInputDto recipeDto) {
        return recipeRepository.save(recipeDto.toRecipe());
    }

    public void removeRecipe(Integer id) {
        recipeRepository.deleteById(id);
    }

    public RecipeOutputDto getRecipe(Integer id) {
        return recipeRepository.findById(id).orElseThrow().toRecipeOutputDto();
    }

    public void addTagsToRecipe(Integer id, List<Integer> tagIds) {
        var recipe = recipeRepository.findById(id).orElseThrow();
        recipe.setTags(tagIds.stream().map(tagId -> Tag.builder().id(tagId).build()).collect(toSet()));
        recipeRepository.save(recipe);
    }
}
