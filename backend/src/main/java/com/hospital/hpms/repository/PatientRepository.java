package com.hospital.hpms.repository;

import com.hospital.hpms.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientNumber(String patientNumber);
    boolean existsByPhoneNumber(String phoneNumber);
    Optional<Patient> findByUserId(Long userId);
}
