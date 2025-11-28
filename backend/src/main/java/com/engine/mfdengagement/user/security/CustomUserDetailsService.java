package com.engine.mfdengagement.user.security;

import com.engine.mfdengagement.security.CustomUserDetails;
import com.engine.mfdengagement.user.entity.User;
import com.engine.mfdengagement.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        System.out.println("CustomUserDetailsService.loadUserByUsername called with: " + usernameOrEmail);
        // Allow login with either username or email
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> {
                    System.out.println("User not found in repository for: " + usernameOrEmail);
                    return new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail);
                });
        System.out.println("User found: " + user.getUsername() + ", Tenant: " + user.getTenant().getTenantId());
        return new CustomUserDetails(user);
    }
}