package com.hospital.hpms.controller;

import com.hospital.hpms.entity.Appointment;
import com.hospital.hpms.entity.enums.AppointmentStatus;
import com.hospital.hpms.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PATIENT','RECEPTIONIST','NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<Appointment> create(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.create(appointment));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT','RECEPTIONIST','NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<List<Appointment>> byPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<Appointment>> byDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getByDoctor(doctorId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST','DOCTOR','ADMIN')")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT','RECEPTIONIST','NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        appointmentService.cancel(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available-slots")
    @PreAuthorize("hasAnyRole('PATIENT','RECEPTIONIST','NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<List<String>> availableSlots() {
        // Simplified fixed daily slot list; replace with real calendar logic against doctor schedules.
        return ResponseEntity.ok(List.of("09:00","09:30","10:00","10:30","11:00","11:30",
                "14:00","14:30","15:00","15:30","16:00","16:30"));
    }
}
