package com.hospital.hpms.controller;

import com.hospital.hpms.entity.AuditLog;
import com.hospital.hpms.repository.*;
import com.hospital.hpms.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuditService auditService;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BedRepository bedRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> auditLogs() {
        return ResponseEntity.ok(auditService.getAll());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> analytics() {
        long totalPatients = patientRepository.count();
        long totalUsers = userRepository.count();
        long totalBeds = bedRepository.count();
        long occupiedBeds = bedRepository.findByStatus(com.hospital.hpms.entity.enums.BedStatus.OCCUPIED).size();
        long totalAppointments = appointmentRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalPatients", totalPatients,
                "totalUsers", totalUsers,
                "totalBeds", totalBeds,
                "occupiedBeds", occupiedBeds,
                "bedOccupancyRate", totalBeds == 0 ? 0 : Math.round((occupiedBeds * 100.0) / totalBeds),
                "totalAppointments", totalAppointments
        ));
    }

    @GetMapping("/system-health")
    public ResponseEntity<Map<String, String>> systemHealth() {
        return ResponseEntity.ok(Map.of("status", "UP", "database", "UP"));
    }
}
