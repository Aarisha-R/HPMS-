package com.hospital.hpms.controller;

import com.hospital.hpms.entity.Bill;
import com.hospital.hpms.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('RECEPTIONIST','PHARMACIST','DOCTOR','ADMIN')")
    public ResponseEntity<Bill> generate(@RequestBody Bill bill) {
        return ResponseEntity.ok(billingService.generate(bill));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<Bill>> byPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(billingService.getByPatient(patientId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        billingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/payment")
    @PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
    public ResponseEntity<Bill> recordPayment(@PathVariable Long id, @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(billingService.recordPayment(id, amount));
    }
}
