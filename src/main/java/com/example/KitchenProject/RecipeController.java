package com.example.KitchenProject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class RecipeController {
    List <Recipe> recipes = Arrays.asList(
            new Recipe("parówki", Arrays.asList(new Ingredient("parówka",4,QuantityUnit.GRAM)), "domowy", 10, CookingLevel.MASTER),
            new Recipe("tosty",Arrays.asList(new Ingredient("chleb tostowy",2,QuantityUnit.CUP), new Ingredient("szynka",1,QuantityUnit.LITER), new Ingredient("ser",1,QuantityUnit.SPOON)),"domowy",5,CookingLevel.EASY),
            new Recipe("chrupki z mlekiem", Arrays.asList(new Ingredient("chrupki",100,QuantityUnit.GRAM),new Ingredient("mleko",300, QuantityUnit.MILILITER)),"starożytny", 15,CookingLevel.MEDIUM));

    @GetMapping("/recipe")
    public List<Recipe> getRecipes(){
        return recipes;
    }
}
