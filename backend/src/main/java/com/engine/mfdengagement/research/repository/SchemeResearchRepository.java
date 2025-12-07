package com.engine.mfdengagement.research.repository;

import com.engine.mfdengagement.research.model.SchemeResearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeResearchRepository extends JpaRepository<SchemeResearch, Long> {

    @Query("SELECT sr FROM SchemeResearch sr JOIN FETCH sr.schemeMaster sm WHERE sm.schemeCategory = :category ORDER BY sr.alpha3y DESC")
    List<SchemeResearch> findTopFundsByAlpha3y(String category);

}
