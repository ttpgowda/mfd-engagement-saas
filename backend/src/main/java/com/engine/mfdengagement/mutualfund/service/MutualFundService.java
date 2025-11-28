package com.engine.mfdengagement.mutualfund.service;

import com.engine.mfdengagement.mutualfund.domain.NavHistory;
import com.engine.mfdengagement.mutualfund.domain.SchemeAnalytics;
import com.engine.mfdengagement.mutualfund.domain.SchemeMaster;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface MutualFundService {
    Page<SchemeMaster> getAllSchemes(Pageable pageable);

    Optional<SchemeMaster> getSchemeById(Long schemeCode);

    Optional<SchemeAnalytics> getSchemeAnalytics(Long schemeCode);

    Page<NavHistory> getNavHistory(Long schemeCode, Pageable pageable);

    Page<SchemeAnalytics> getAllSchemeAnalytics(Pageable pageable);
}
