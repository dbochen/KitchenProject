package com.example.kitchenproject.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.validation.ConstraintViolationException;
import java.util.Map;

@ControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<String> handleConstraintViolationException(ConstraintViolationException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(IngredientInUseException.class)
    public ResponseEntity<Map<String, Long>> handleIngredientInUse(IngredientInUseException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("recipeCount", ex.getRecipeCount()));
    }
}
