package com.hospital.hpms.service;

import com.hospital.hpms.entity.MedicalRecord;
import com.hospital.hpms.exception.ResourceNotFoundException;
import com.hospital.hpms.repository.MedicalRecordRepository;
import com.hospital.hpms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public MedicalRecord create(MedicalRecord record) {
        patientRepository.findById(record.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient must be registered before a clinical record can be created"));
        return medicalRecordRepository.save(record);
    }

    public List<MedicalRecord> getByPatient(Long patientId) {
        Long recordPatientId = patientRepository.findByUserId(patientId)
                .map(patient -> patient.getId())
                .orElse(patientId);
        return medicalRecordRepository.findByPatientId(recordPatientId);
    }

    public MedicalRecord getById(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found"));
    }

    @Transactional
    public MedicalRecord update(Long id, MedicalRecord updated) {
        MedicalRecord existing = getById(id);
        existing.setDiagnosis(updated.getDiagnosis());
        existing.setIcdCode(updated.getIcdCode());
        existing.setTreatmentPlan(updated.getTreatmentPlan());
        existing.setFollowUpDate(updated.getFollowUpDate());
        existing.setNotes(updated.getNotes());
        return medicalRecordRepository.save(existing);
    }
}
