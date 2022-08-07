package com.example.kitchenproject.service;

import com.example.kitchenproject.dto.RecipeDto;
import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.model.QuantifiedIngredient;
import com.example.kitchenproject.model.Recipe;
import com.example.kitchenproject.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import static java.util.stream.Collectors.toList;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;


    public RecipeService(@Autowired RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public List<Recipe> getAllRecipes(String sort) {
        List<Integer> ids = Arrays.stream(sort.split(","))
                .filter(id -> !id.equals(""))
                .map(Integer::parseInt)
                .collect(toList());

        Map<Recipe, Double> result = new HashMap<>();

        for (Recipe recipe : recipeRepository.findAll()) {
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

    public Recipe save(RecipeDto recipeDto) {
        return recipeRepository.save(recipeDto.toRecipe());
    }

    public void removeRecipe(Integer id) {
        recipeRepository.deleteById(id);
    }
}
