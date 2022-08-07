package com.example.kitchenproject.service;

import com.example.kitchenproject.dto.TagDto;
import com.example.kitchenproject.model.Tag;
import com.example.kitchenproject.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(@Autowired TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Tag save(TagDto tagDto) {
        return tagRepository.save(tagDto.toTag());
    }
}
