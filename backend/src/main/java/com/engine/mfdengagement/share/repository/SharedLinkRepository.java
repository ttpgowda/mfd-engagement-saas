package com.engine.mfdengagement.share.repository;

import com.engine.mfdengagement.share.entity.SharedLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SharedLinkRepository extends JpaRepository<SharedLink, Long> {
    Optional<SharedLink> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);
}
