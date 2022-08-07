package com.example.kitchenproject.controller;

import com.example.kitchenproject.dto.TagDto;
import com.example.kitchenproject.model.Tag;
import com.example.kitchenproject.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static com.example.kitchenproject.config.Config.UI_ORIGIN;

@RestController
@Validated
@CrossOrigin(origins = UI_ORIGIN)
public class TagController {

    private final TagService tagService;

    public TagController(@Autowired TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/tags")
    public Tag addTag(@Valid @RequestBody TagDto tagDto) {
        return tagService.save(tagDto);
    }
}
