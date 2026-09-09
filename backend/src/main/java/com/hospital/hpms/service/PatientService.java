package com.hospital.hpms.service;

import com.hospital.hpms.dto.PatientRequest;
import com.hospital.hpms.entity.Patient;
import com.hospital.hpms.entity.enums.PatientStatus;
import com.hospital.hpms.exception.DuplicatePatientException;
import com.hospital.hpms.exception.InvalidPatientNameException;
import com.hospital.hpms.exception.PatientNotFoundException;
import com.hospital.hpms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional
    public Patient register(PatientRequest req) {
        return register(req, null);
    }

    @Transactional
    public Patient register(PatientRequest req, Long userId) {
        if (userId != null && patientRepository.findByUserId(userId).isPresent()) {
            throw new DuplicatePatientException("A patient profile already exists for this account");
        }
        validateName(req.getName());
        validateDob(req.getDateOfBirth());

        Patient patient = Patient.builder()
            .userId(userId)
                .patientNumber(generatePatientNumber())
                .name(req.getName().trim())
                .dateOfBirth(req.getDateOfBirth())
                .gender(req.getGender())
                .bloodGroup(req.getBloodGroup())
                .phoneNumber(req.getPhoneNumber())
                .address(req.getAddress())
                .emergencyContactName(req.getEmergencyContactName())
                .emergencyContactPhone(req.getEmergencyContactPhone())
                .insuranceId(req.getInsuranceId())
                .status(PatientStatus.ACTIVE)
                .build();

        return patientRepository.save(patient);
    }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with id: " + id));
    }

    public Patient getByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new PatientNotFoundException("Patient profile not found for this account"));
    }

    public List<Patient> getAll() {
        return patientRepository.findAll();
    }

    @Transactional
    public Patient update(Long id, PatientRequest req) {
        Patient patient = getById(id);
        validateName(req.getName());
        validateDob(req.getDateOfBirth());

        patient.setName(req.getName().trim());
        patient.setDateOfBirth(req.getDateOfBirth());
        patient.setGender(req.getGender());
        patient.setBloodGroup(req.getBloodGroup());
        patient.setPhoneNumber(req.getPhoneNumber());
        patient.setAddress(req.getAddress());
        patient.setEmergencyContactName(req.getEmergencyContactName());
        patient.setEmergencyContactPhone(req.getEmergencyContactPhone());
        patient.setInsuranceId(req.getInsuranceId());
        return patientRepository.save(patient);
    }

    @Transactional
    public void deactivate(Long id) {
        Patient patient = getById(id);
        patient.setStatus(PatientStatus.DISCHARGED);
        patientRepository.save(patient);
    }

    public List<Patient> search(String query) {
        String q = query == null ? "" : query.trim().toLowerCase();
        return patientRepository.findAll().stream()
                .filter(p -> p.getName().toLowerCase().contains(q)
                        || p.getPatientNumber().toLowerCase().contains(q)
                        || p.getPhoneNumber().contains(q))
                .toList();
    }

    private void validateName(String name) {
        if (name == null || !name.trim().matches("^[A-Za-z ]{2,100}$")) {
            throw new InvalidPatientNameException("Name must not contain special characters or numbers");
        }
    }

    private void validateDob(String dob) {
        try {
            LocalDate date = LocalDate.parse(dob);
            if (date.isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("Invalid date of birth");
            }
            int age = Period.between(date, LocalDate.now()).getYears();
            if (age > 150) {
                throw new IllegalArgumentException("Invalid date of birth");
            }
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date of birth");
        }
    }

    private String generatePatientNumber() {
        return "HPMS-" + (100000 + (int) (Math.random() * 900000));
    }
}
