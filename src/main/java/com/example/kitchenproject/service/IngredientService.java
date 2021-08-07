package com.example.kitchenproject.service;

import com.example.kitchenproject.dto.IngredientDto;
import com.example.kitchenproject.model.Ingredient;
import com.example.kitchenproject.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.function.Predicate;

import static java.util.stream.Collectors.toList;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(@Autowired IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<Ingredient> getAllIngredients(String search, int limit) {
        return ingredientRepository.findAll().stream()
                .filter(matchesSearchPhrase(search))
                .limit(limit)
                .collect(toList());
    }

    private Predicate<Ingredient> matchesSearchPhrase(String search) {
        return ingredient -> ingredient.getName().toLowerCase(Locale.ROOT).startsWith(search.toLowerCase(Locale.ROOT));
    }

    public Ingredient save(IngredientDto ingredientDto) {
        return ingredientRepository.save(Ingredient.builder().name(ingredientDto.getName()).build());
    }
}
