package com.engine.mfdengagement.research.controller;

import com.engine.mfdengagement.research.dto.TopFundsRequest;
import com.engine.mfdengagement.research.dto.TopFundsResponse;
import com.engine.mfdengagement.research.service.ResearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/research")
@RequiredArgsConstructor
public class PublicResearchController {

    private final ResearchService researchService;

    @GetMapping("/funds/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(researchService.getAllCategories());
    }

    @PostMapping("/funds/top-performing")
    public ResponseEntity<TopFundsResponse> getTopPerformingFunds(@RequestBody TopFundsRequest request) {
        return ResponseEntity.ok(researchService.getTopPerformingFunds(request));
    }
}
