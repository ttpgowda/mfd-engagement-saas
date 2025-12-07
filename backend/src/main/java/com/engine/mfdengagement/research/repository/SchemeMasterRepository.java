package com.engine.mfdengagement.research.repository;

import com.engine.mfdengagement.research.model.SchemeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeMasterRepository extends JpaRepository<SchemeMaster, Long> {
    List<SchemeMaster> findBySchemeCategory(String schemeCategory);

    @Query("SELECT DISTINCT s.schemeCategory FROM SchemeMaster s WHERE s.isTracked = true ORDER BY s.schemeCategory")
    List<String> findDistinctCategories();

    List<SchemeMaster> findBySchemeCategoryAndIsTrackedTrueOrderBySchemeNameAsc(String schemeCategory);

}
