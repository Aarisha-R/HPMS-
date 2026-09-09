package com.hospital.hpms.controller;

import com.hospital.hpms.dto.PatientRequest;
import com.hospital.hpms.entity.Patient;
import com.hospital.hpms.service.PatientService;
import com.hospital.hpms.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('RECEPTIONIST','NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<Patient> register(@Valid @RequestBody PatientRequest request) {
        return ResponseEntity.ok(patientService.register(request));
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Patient> registerSelf(@Valid @RequestBody PatientRequest request,
                                                  @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(patientService.register(request, principal.getUser().getId()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Patient> getSelf(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(patientService.getByUserId(principal.getUser().getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','RECEPTIONIST','NURSE','PHARMACIST','DOCTOR','ADMIN')")
    public ResponseEntity<List<Patient>> getAll() {
        return ResponseEntity.ok(patientService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','RECEPTIONIST','NURSE','PHARMACIST','DOCTOR','ADMIN','PATIENT')")
    public ResponseEntity<Patient> getById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST','NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<Patient> update(@PathVariable Long id, @Valid @RequestBody PatientRequest request) {
        return ResponseEntity.ok(patientService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        patientService.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','RECEPTIONIST','NURSE','PHARMACIST','DOCTOR','ADMIN')")
    public ResponseEntity<List<Patient>> search(@RequestParam String query) {
        return ResponseEntity.ok(patientService.search(query));
    }
}
