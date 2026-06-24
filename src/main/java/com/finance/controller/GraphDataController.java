package com.finance.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/finance/graph/v1")
public class GraphDataController {

    @GetMapping("/data")
    public List<Map<String, Object>> getGraphData() {
        return List.of(
            Map.of("name", "Jan", "uv", 4000, "pv", 2400, "amt", 2400),
            Map.of("name", "Feb", "uv", 3000, "pv", 1398, "amt", 2210),
            Map.of("name", "Mar", "uv", 2000, "pv", 9800, "amt", 2290),
            Map.of("name", "Apr", "uv", 2780, "pv", 3908, "amt", 2000),
            Map.of("name", "May", "uv", 1890, "pv", 4800, "amt", 2181),
            Map.of("name", "Jun", "uv", 2390, "pv", 3800, "amt", 2500),
            Map.of("name", "Jul", "uv", 3490, "pv", 4300, "amt", 2100)
        );
    }
}
