package com.hospital.hpms.entity;

import com.hospital.hpms.entity.enums.BedStatus;
import com.hospital.hpms.entity.enums.BedType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "beds")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ward_id", nullable = false)
    private Long wardId;

    @Column(name = "bed_number", nullable = false)
    private String bedNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "bed_type")
    private BedType bedType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BedStatus status = BedStatus.AVAILABLE;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "assignment_date")
    private LocalDateTime assignmentDate;
}
