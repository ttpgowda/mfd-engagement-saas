package com.engine.mfdengagement.user.repository;

import com.engine.mfdengagement.user.entity.PasswordResetToken;
import com.engine.mfdengagement.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);
}
