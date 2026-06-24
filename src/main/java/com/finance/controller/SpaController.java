package com.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
        "/",
        "/finance/auth/v1/login",
        "/finance/auth/v1/register",
        "/finance/dashboard/v1",
        "/finance/dashboard/v1/**"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
