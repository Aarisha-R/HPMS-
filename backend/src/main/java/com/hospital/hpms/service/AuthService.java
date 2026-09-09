package com.hospital.hpms.service;

import com.hospital.hpms.dto.AuthResponse;
import com.hospital.hpms.dto.ForgotPasswordRequest;
import com.hospital.hpms.dto.ForgotPasswordResponse;
import com.hospital.hpms.dto.LoginRequest;
import com.hospital.hpms.dto.RegisterRequest;
import com.hospital.hpms.dto.ResetPasswordRequest;
import com.hospital.hpms.entity.User;
import com.hospital.hpms.entity.enums.Role;
import com.hospital.hpms.exception.DuplicateUserException;
import com.hospital.hpms.exception.InvalidCredentialsException;
import com.hospital.hpms.repository.UserRepository;
import com.hospital.hpms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int RESET_TOKEN_MINUTES = 30;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUserException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException("Email already registered");
        }
        if (request.getRole() != Role.PATIENT) {
            if (request.getStaffId() == null || request.getStaffId().isBlank()) {
                throw new IllegalArgumentException("Staff ID is required");
            }
            if (userRepository.existsByStaffId(request.getStaffId())) {
                throw new DuplicateUserException("Staff ID already exists");
            }
        }
        if (request.getRole() == Role.DOCTOR
                && (request.getSpecialization() == null || request.getSpecialization().isBlank())) {
            throw new IllegalArgumentException("Specialization is required for doctors");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .departmentId(request.getDepartmentId())
                .staffId(request.getRole() == Role.PATIENT ? null : request.getStaffId())
                .specialization(request.getRole() == Role.DOCTOR ? request.getSpecialization() : null)
                .isActive(true)
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameOrEmailOrStaffId(request.getIdentifier())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (user.getLockTime() != null && user.getLockTime().isAfter(LocalDateTime.now())) {
            throw new InvalidCredentialsException("Account temporarily locked due to failed login attempts. Try again later.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            registerFailedAttempt(user);
            throw new InvalidCredentialsException("Invalid username or password");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new InvalidCredentialsException("Account is inactive. Contact an administrator.");
        }

        user.setFailedAttempts(0);
        user.setLockTime(null);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole());
    }

    @Transactional
    public ForgotPasswordResponse requestPasswordReset(ForgotPasswordRequest request) {
        User user = userRepository.findByUsernameOrEmailOrStaffId(request.getIdentifier()).orElse(null);
        if (user == null || !Boolean.TRUE.equals(user.getIsActive())) {
            return new ForgotPasswordResponse("If an account matches, reset instructions have been sent.", null);
        }

        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        user.setPasswordResetTokenHash(hashToken(token));
        user.setPasswordResetTokenExpiresAt(LocalDateTime.now().plusMinutes(RESET_TOKEN_MINUTES));
        userRepository.save(user);
        return new ForgotPasswordResponse("If an account matches, reset instructions have been sent.", token);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetTokenHash(hashToken(request.getToken()))
                .orElseThrow(() -> new InvalidCredentialsException("This reset link is invalid or has expired."));

        if (user.getPasswordResetTokenExpiresAt() == null
                || user.getPasswordResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialsException("This reset link is invalid or has expired.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetTokenExpiresAt(null);
        user.setFailedAttempts(0);
        user.setLockTime(null);
        userRepository.save(user);
    }

    private String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Unable to create password reset token", exception);
        }
    }

    private void registerFailedAttempt(User user) {
        int attempts = (user.getFailedAttempts() == null ? 0 : user.getFailedAttempts()) + 1;
        user.setFailedAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            // Progressive lockout: doubles roughly with repeated lockouts in a fuller impl;
            // fixed 15-minute window here per SRS FR2 baseline.
            user.setLockTime(LocalDateTime.now().plusMinutes(15));
        }
        userRepository.save(user);
    }
}
