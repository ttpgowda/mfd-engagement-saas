package com.engine.mfdengagement.user.service;

import com.engine.mfdengagement.Util.TenantUtil;
import com.engine.mfdengagement.security.CustomUserDetails;
import com.engine.mfdengagement.security.JwtTokenProvider;
import com.engine.mfdengagement.tenant.config.TenantContext;
import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import com.engine.mfdengagement.user.dto.AuthResponse;
import com.engine.mfdengagement.user.dto.LoginRequest;
import com.engine.mfdengagement.user.dto.RegisterRequest;
import com.engine.mfdengagement.user.entity.RefreshToken;
import com.engine.mfdengagement.user.entity.Role;
import com.engine.mfdengagement.user.entity.User;
import com.engine.mfdengagement.user.helper.RoleServiceHelper;
import com.engine.mfdengagement.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.Filter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final RoleServiceHelper roleServiceHelper;
    private final RefreshTokenService refreshTokenService;
    private final TenantRepository tenantRepository;
    private final EntityManager entityManager;
    private final com.engine.mfdengagement.notification.email.EmailService emailService;
    private final com.engine.mfdengagement.user.repository.VerificationTokenRepository verificationTokenRepository;
    private final com.engine.mfdengagement.user.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    @org.springframework.beans.factory.annotation.Value("${app.domain:localhost}")
    private String appDomain;

    public AuthResponse authenticate(LoginRequest request) {
        // TenantId is inferred from Subdomain/Header via TenantFilter before this
        // service is called.
        String tenantId = TenantContext.getTenantId();

        // Fallback or explicit default
        if (tenantId == null || tenantId.isEmpty()) {
            tenantId = TenantUtil.DEFAULT_TENANT;
        }

        TenantContext.setTenantId(tenantId);

        System.out.println("AuthService: Authenticating user: " + request.getUsername() + " for tenant: " + tenantId);

        // Manually enable filter to ensure it runs in the current transaction
        Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("tenantFilter");
        filter.setParameter("tenantIdentifier", tenantId);
        System.out.println("AuthService: Enabled tenantFilter for tenant: " + tenantId);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if (!(userDetails instanceof CustomUserDetails)) {
            throw new IllegalStateException("Principal is not an instance of CustomUserDetails");
        }
        User authenticatedUser = ((CustomUserDetails) userDetails).getUser();

        String token = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = refreshTokenService.createRefreshToken(authenticatedUser).getToken();

        return new AuthResponse(token, refreshToken);
    }

    public AuthResponse register(RegisterRequest request) {
        Set<Role> roles = roleServiceHelper.resolveRolesOrDefault(null);

        String username = request.getUsername();
        String email = request.getEmail();
        if (username == null || username.isEmpty()) {
            username = request.getEmail();
        }

        if (userRepository.existsByUsernameOrEmail(username, email)) {
            throw new RuntimeException("Username or Email already exists");
        }

        String currentTenantIdStr = TenantContext.getTenantId();

        if (currentTenantIdStr == null || currentTenantIdStr.equals("default_tenant_id_from_your_config")) {
            currentTenantIdStr = TenantUtil.DEFAULT_TENANT;
        }

        String finalTenantId = currentTenantIdStr;
        Tenant tenant = tenantRepository.findByTenantId(finalTenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found for ID: " + finalTenantId));

        String fullName = (request.getFirstName() != null ? request.getFirstName() : "") +
                (request.getLastName() != null ? " " + request.getLastName() : "");
        fullName = fullName.trim();
        if (fullName.isEmpty()) {
            fullName = "User";
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(fullName)
                .enabled(false) // Disable until verified
                .roles(roles)
                .tenant(tenant)
                .build();

        userRepository.save(user);

        // Create verification token
        com.engine.mfdengagement.user.entity.VerificationToken verificationToken = new com.engine.mfdengagement.user.entity.VerificationToken(
                user);
        verificationTokenRepository.save(verificationToken);

        // Send verification email
        String verificationLink = "http://" + appDomain + ":8080/api/auth/verify-email?token="
                + verificationToken.getToken();

        java.util.Map<String, Object> emailVariables = new java.util.HashMap<>();
        emailVariables.put("name", user.getFullName());
        emailVariables.put("verificationLink", verificationLink);

        emailService.sendHtmlEmail(user.getEmail(), "Verify your email", "verification-email", emailVariables);

        UserDetails userDetails = new CustomUserDetails(user);
        String token = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = refreshTokenService.createRefreshToken(user).getToken();
        return new AuthResponse(token, refreshToken);
    }

    public AuthResponse refreshAccessToken(String refreshTokenStr) {
        String tenantId = TenantContext.getTenantId();
        if (tenantId != null && !tenantId.isEmpty()) {
            Session session = entityManager.unwrap(Session.class);
            Filter filter = session.enableFilter("tenantFilter");
            filter.setParameter("tenantIdentifier", tenantId);
        }

        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException(
                        "Invalid refresh token"));

        User user = refreshToken.getUser();
        UserDetails userDetails = new CustomUserDetails(user);

        String newAccessToken = jwtTokenProvider.generateToken(userDetails);

        // Rotate Refresh Token: Generate a new one (updates token string + expiry)
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(newAccessToken, newRefreshToken.getToken());
    }

    public void logout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        refreshTokenService.deleteByUser(user);
    }

    public void changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        refreshTokenService.deleteByUser(user);
    }

    public void verifyEmail(String token) {
        com.engine.mfdengagement.user.entity.VerificationToken verificationToken = verificationTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Verification token expired");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Create password reset token
        com.engine.mfdengagement.user.entity.PasswordResetToken token = new com.engine.mfdengagement.user.entity.PasswordResetToken(
                user);
        passwordResetTokenRepository.save(token);

        // Send email
        String resetLink = "http://" + appDomain + ":3000/reset-password?token=" + token.getToken();

        java.util.Map<String, Object> emailVariables = new java.util.HashMap<>();
        emailVariables.put("name", user.getFullName());
        emailVariables.put("resetLink", resetLink);

        emailService.sendHtmlEmail(user.getEmail(), "Reset your password", "forgot-password-email", emailVariables);
    }

    public void resetPassword(String token, String newPassword) {
        com.engine.mfdengagement.user.entity.PasswordResetToken resetToken = passwordResetTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }
}