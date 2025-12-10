package com.engine.mfdengagement.user.preference.repository;

import com.engine.mfdengagement.user.preference.entity.UserTemplatePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserTemplatePreferenceRepository extends JpaRepository<UserTemplatePreference, Long> {
    Optional<UserTemplatePreference> findByUserIdAndAspectRatio(Long userId, String aspectRatio);
}
