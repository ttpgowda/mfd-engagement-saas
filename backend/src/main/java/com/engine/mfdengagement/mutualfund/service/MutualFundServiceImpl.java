package com.engine.mfdengagement.mutualfund.service;

import com.engine.mfdengagement.mutualfund.domain.NavHistory;
import com.engine.mfdengagement.mutualfund.domain.SchemeAnalytics;
import com.engine.mfdengagement.mutualfund.domain.SchemeMaster;
import com.engine.mfdengagement.mutualfund.repository.NavHistoryRepository;
import com.engine.mfdengagement.mutualfund.repository.SchemeAnalyticsRepository;
import com.engine.mfdengagement.mutualfund.repository.SchemeMasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MutualFundServiceImpl implements MutualFundService {

    private final SchemeMasterRepository schemeMasterRepository;
    private final SchemeAnalyticsRepository schemeAnalyticsRepository;
    private final NavHistoryRepository navHistoryRepository;

    @Override
    public Page<SchemeMaster> getAllSchemes(Pageable pageable) {
        return schemeMasterRepository.findAll(pageable);
    }

    @Override
    public Optional<SchemeMaster> getSchemeById(Long schemeCode) {
        return schemeMasterRepository.findById(schemeCode);
    }

    @Override
    public Optional<SchemeAnalytics> getSchemeAnalytics(Long schemeCode) {
        return schemeAnalyticsRepository.findById(schemeCode);
    }

    @Override
    public Page<NavHistory> getNavHistory(Long schemeCode, Pageable pageable) {
        return navHistoryRepository.findBySchemeCodeOrderByNavDateAsc(schemeCode, pageable);
    }

    @Override
    public Page<SchemeAnalytics> getAllSchemeAnalytics(Pageable pageable) {
        return schemeAnalyticsRepository.findAll(pageable);
    }
}
