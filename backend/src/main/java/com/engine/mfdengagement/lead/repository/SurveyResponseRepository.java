package com.engine.mfdengagement.lead.repository;

import com.engine.mfdengagement.lead.entity.SurveyResponse;
import com.engine.mfdengagement.lead.entity.SurveyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {

    Optional<SurveyResponse> findBySessionIdAndSurveyType(String sessionId, String surveyType);

    List<SurveyResponse> findAllByTenantIdOrderByCreatedAtDesc(Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, SurveyStatus status);
}
