package com.example.kitchenproject.controller;

import com.example.kitchenproject.dto.TagDto;
import com.example.kitchenproject.model.Tag;
import com.example.kitchenproject.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

import static com.example.kitchenproject.config.Config.UI_ORIGIN;

@RestController
@Validated
@CrossOrigin(origins = UI_ORIGIN, methods = {RequestMethod.GET, RequestMethod.POST})
public class TagController {

    private final TagService tagService;

    public TagController(@Autowired TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("/tags")
    public List<Tag> getTags() {
        return tagService.findAll();
    }

    @PostMapping("/tags")
    public Tag addTag(@Valid @RequestBody TagDto tagDto) {
        return tagService.save(tagDto);
    }
}
