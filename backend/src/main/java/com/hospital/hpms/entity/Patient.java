package com.hospital.hpms.entity;

import com.hospital.hpms.entity.enums.BloodGroup;
import com.hospital.hpms.entity.enums.Gender;
import com.hospital.hpms.entity.enums.PatientStatus;
import com.hospital.hpms.util.PhiAttributeConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true)
    private Long userId;

    @Column(name = "patient_number", unique = true, nullable = false)
    private String patientNumber;

    // AES-256 Encrypted PHI fields, per DB design
    @Convert(converter = PhiAttributeConverter.class)
    @Column(nullable = false)
    private String name;

    @Convert(converter = PhiAttributeConverter.class)
    @Column(name = "date_of_birth", nullable = false)
    private String dateOfBirth; // stored encrypted as ISO string, parsed at service layer

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group")
    private BloodGroup bloodGroup;

    @Convert(converter = PhiAttributeConverter.class)
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Convert(converter = PhiAttributeConverter.class)
    @Column(name = "address")
    private String address;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Convert(converter = PhiAttributeConverter.class)
    @Column(name = "insurance_id")
    private String insuranceId;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PatientStatus status = PatientStatus.ACTIVE;

    @PrePersist
    public void prePersist() {
        if (registrationDate == null) registrationDate = LocalDateTime.now();
        if (status == null) status = PatientStatus.ACTIVE;
    }
}
