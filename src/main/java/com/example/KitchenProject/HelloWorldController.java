package com.example.KitchenProject;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.KitchenProject.config.Config.UI_ORIGIN;

@RestController
@CrossOrigin(origins = UI_ORIGIN)
public class HelloWorldController {

    @GetMapping("/hello")
    public String sayHelloWorld() {
        return "Hello World!";
    }

}
