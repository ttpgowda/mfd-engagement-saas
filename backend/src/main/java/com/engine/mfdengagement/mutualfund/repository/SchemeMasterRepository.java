package com.engine.mfdengagement.mutualfund.repository;

import com.engine.mfdengagement.mutualfund.domain.SchemeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemeMasterRepository extends JpaRepository<SchemeMaster, Long> {
}
