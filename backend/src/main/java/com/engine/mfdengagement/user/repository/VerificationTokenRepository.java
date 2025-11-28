package com.engine.mfdengagement.user.repository;

import com.engine.mfdengagement.user.entity.User;
import com.engine.mfdengagement.user.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);

    Optional<VerificationToken> findByUser(User user);
}
