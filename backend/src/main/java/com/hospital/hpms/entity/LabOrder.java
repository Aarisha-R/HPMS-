package com.hospital.hpms.entity;

import com.hospital.hpms.entity.enums.LabOrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LabOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Column(name = "test_code")
    private String testCode;

    @Column(name = "specimen_type")
    private String specimenType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LabOrderStatus status = LabOrderStatus.ORDERED;

    @Column(name = "ordered_date")
    private LocalDateTime orderedDate;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    @PrePersist
    public void prePersist() {
        if (orderedDate == null) orderedDate = LocalDateTime.now();
        if (status == null) status = LabOrderStatus.ORDERED;
    }
}
