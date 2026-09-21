package com.hospital.hpms.repository;

import com.hospital.hpms.entity.Prescription;
import com.hospital.hpms.entity.enums.DispensingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByDispensingStatusOrderByPrescriptionDateAsc(DispensingStatus dispensingStatus);
}
