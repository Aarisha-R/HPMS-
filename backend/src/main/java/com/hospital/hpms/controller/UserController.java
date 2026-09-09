package com.hospital.hpms.controller;

import com.hospital.hpms.entity.User;
import com.hospital.hpms.entity.enums.Role;
import com.hospital.hpms.repository.UserRepository;
import com.hospital.hpms.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> profile(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(principal.getUser());
    }

    @PutMapping("/api/users/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal CustomUserDetails principal,
                                               @RequestBody User updates) {
        User user = principal.getUser();
        if (updates.getEmail() != null) user.setEmail(updates.getEmail());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/api/doctors")
    @PreAuthorize("hasAnyRole('PATIENT','RECEPTIONIST','DOCTOR','ADMIN','NURSE','PHARMACIST','LAB_TECHNICIAN')")
    public ResponseEntity<List<User>> doctors() {
        return ResponseEntity.ok(userRepository.findByRoleAndIsActiveTrue(Role.DOCTOR));
    }

    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/api/admin/users/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> deactivate(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setIsActive(false);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/api/admin/users/{id}/specialization")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateSpecialization(@PathVariable Long id, @RequestBody User updates) {
        User user = userRepository.findById(id).orElseThrow();
        if (user.getRole() != Role.DOCTOR || updates.getSpecialization() == null || updates.getSpecialization().isBlank()) {
            throw new IllegalArgumentException("A valid doctor specialization is required");
        }
        user.setSpecialization(updates.getSpecialization().trim());
        return ResponseEntity.ok(userRepository.save(user));
    }
}
