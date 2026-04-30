package com.example.kitchenproject.dto;

import com.example.kitchenproject.model.Tag;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class TagDto {
    @Size(min = 1, max = 100)
    @NotNull
    private String name;

    public Tag toTag() {
        return Tag.builder().name(name).build();
    }
}
