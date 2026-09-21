package com.hospital.hpms.service;

import com.hospital.hpms.entity.Prescription;
import com.hospital.hpms.entity.enums.DispensingStatus;
import com.hospital.hpms.exception.ResourceNotFoundException;
import com.hospital.hpms.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    @Transactional
    public Prescription create(Prescription prescription) {
        prescription.setDispensingStatus(DispensingStatus.PENDING);
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPending() {
        return prescriptionRepository.findByDispensingStatusOrderByPrescriptionDateAsc(DispensingStatus.PENDING);
    }

    @Transactional
    public Prescription updateDispensingStatus(Long id, DispensingStatus status) {
        Prescription p = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));
        p.setDispensingStatus(status);
        return prescriptionRepository.save(p);
    }
}
