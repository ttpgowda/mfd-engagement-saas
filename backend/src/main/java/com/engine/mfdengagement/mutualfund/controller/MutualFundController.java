package com.engine.mfdengagement.mutualfund.controller;

import com.engine.mfdengagement.mutualfund.domain.NavHistory;
import com.engine.mfdengagement.mutualfund.domain.SchemeAnalytics;
import com.engine.mfdengagement.mutualfund.domain.SchemeMaster;
import com.engine.mfdengagement.mutualfund.service.MutualFundService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mutual-funds")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('MUTUAL_FUND_READ')")
public class MutualFundController {

    private final MutualFundService mutualFundService;

    @GetMapping("/schemes")
    public ResponseEntity<Page<SchemeMaster>> getAllSchemes(Pageable pageable) {
        return ResponseEntity.ok(mutualFundService.getAllSchemes(pageable));
    }

    @GetMapping("/schemes/{schemeCode}")
    public ResponseEntity<SchemeMaster> getSchemeById(@PathVariable Long schemeCode) {
        return mutualFundService.getSchemeById(schemeCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Page<SchemeAnalytics>> getAllSchemeAnalytics(Pageable pageable) {
        return ResponseEntity.ok(mutualFundService.getAllSchemeAnalytics(pageable));
    }

    @GetMapping("/analytics/{schemeCode}")
    public ResponseEntity<SchemeAnalytics> getSchemeAnalytics(@PathVariable Long schemeCode) {
        return mutualFundService.getSchemeAnalytics(schemeCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nav-history/{schemeCode}")
    public ResponseEntity<Page<NavHistory>> getNavHistory(@PathVariable Long schemeCode, Pageable pageable) {
        return ResponseEntity.ok(mutualFundService.getNavHistory(schemeCode, pageable));
    }
}
