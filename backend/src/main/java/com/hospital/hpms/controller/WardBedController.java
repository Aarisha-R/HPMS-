package com.hospital.hpms.controller;

import com.hospital.hpms.entity.Bed;
import com.hospital.hpms.entity.Ward;
import com.hospital.hpms.service.WardBedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wards")
@RequiredArgsConstructor
public class WardBedController {

    private final WardBedService wardBedService;

    @GetMapping
    @PreAuthorize("hasAnyRole('NURSE','DOCTOR','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<Ward>> getAllWards() {
        return ResponseEntity.ok(wardBedService.getAllWards());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('NURSE','ADMIN')")
    public ResponseEntity<Ward> createWard(@RequestBody Ward ward) {
        return ResponseEntity.ok(wardBedService.createWard(ward));
    }

    @GetMapping("/{wardId}/beds")
    @PreAuthorize("hasAnyRole('NURSE','DOCTOR','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<Bed>> bedsByWard(@PathVariable Long wardId) {
        return ResponseEntity.ok(wardBedService.getBedsByWard(wardId));
    }

    @GetMapping("/beds/available")
    @PreAuthorize("hasAnyRole('NURSE','DOCTOR','RECEPTIONIST','ADMIN')")
    public ResponseEntity<List<Bed>> availableBeds() {
        return ResponseEntity.ok(wardBedService.getAvailableBeds());
    }

    @PostMapping("/beds")
    @PreAuthorize("hasAnyRole('NURSE','ADMIN')")
    public ResponseEntity<Bed> createBed(@RequestBody Bed bed) {
        return ResponseEntity.ok(wardBedService.createBed(bed));
    }

    @PutMapping("/beds/{bedId}/assign")
    @PreAuthorize("hasAnyRole('NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<Bed> assignBed(@PathVariable Long bedId, @RequestParam Long patientId) {
        return ResponseEntity.ok(wardBedService.assignBed(bedId, patientId));
    }

    @PutMapping("/beds/{bedId}/discharge")
    @PreAuthorize("hasAnyRole('NURSE','DOCTOR','ADMIN')")
    public ResponseEntity<Bed> dischargeBed(@PathVariable Long bedId) {
        return ResponseEntity.ok(wardBedService.dischargeBed(bedId));
    }
}
