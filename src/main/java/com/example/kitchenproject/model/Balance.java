package com.example.kitchenproject.model;

import lombok.Getter;

@Getter
public enum Balance {
    VERY_BALANCING(2), // 0
    BALANCING(1), // 1
    AGGRAVATING(-1), // 2
    VERY_AGGRAVATING(-2), // 3
    ; // 3

    private final int value;

    Balance(int value) {
        this.value = value;
    }
}
