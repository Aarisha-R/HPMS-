package com.hospital.hpms.controller;

import com.hospital.hpms.entity.LabOrder;
import com.hospital.hpms.entity.LabResult;
import com.hospital.hpms.service.LabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab")
@RequiredArgsConstructor
public class LabController {

    private final LabService labService;

    @PostMapping("/orders")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<LabOrder> createOrder(@RequestBody LabOrder order) {
        return ResponseEntity.ok(labService.createOrder(order));
    }

    @GetMapping("/orders/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','LAB_TECHNICIAN','ADMIN')")
    public ResponseEntity<List<LabOrder>> byPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(labService.getOrdersByPatient(patientId));
    }

    @PutMapping("/results/{orderId}")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','ADMIN')")
    public ResponseEntity<LabResult> enterResult(@PathVariable Long orderId, @RequestBody LabResult result) {
        return ResponseEntity.ok(labService.enterResult(orderId, result));
    }

    @GetMapping("/results/pending")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','DOCTOR','ADMIN')")
    public ResponseEntity<List<LabOrder>> pending() {
        return ResponseEntity.ok(labService.getPendingOrders());
    }

    @GetMapping("/critical-values")
    @PreAuthorize("hasAnyRole('LAB_TECHNICIAN','DOCTOR','ADMIN')")
    public ResponseEntity<List<LabResult>> criticalValues() {
        return ResponseEntity.ok(labService.getCriticalValues());
    }
}
