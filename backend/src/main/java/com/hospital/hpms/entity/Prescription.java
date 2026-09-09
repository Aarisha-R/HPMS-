package com.hospital.hpms.entity;

import com.hospital.hpms.entity.enums.DispensingStatus;
import com.hospital.hpms.entity.enums.MedicationRoute;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "medication_name", nullable = false)
    private String medicationName;

    @Column(nullable = false)
    private String dosage;

    private String frequency;

    private String duration;

    @Enumerated(EnumType.STRING)
    private MedicationRoute route;

    @Enumerated(EnumType.STRING)
    @Column(name = "dispensing_status")
    @Builder.Default
    private DispensingStatus dispensingStatus = DispensingStatus.PENDING;

    @Column(name = "prescription_date")
    private LocalDateTime prescriptionDate;

    @PrePersist
    public void prePersist() {
        if (prescriptionDate == null) prescriptionDate = LocalDateTime.now();
        if (dispensingStatus == null) dispensingStatus = DispensingStatus.PENDING;
    }
}
