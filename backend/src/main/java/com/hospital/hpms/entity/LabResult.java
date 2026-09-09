package com.hospital.hpms.entity;

import com.hospital.hpms.entity.enums.ResultFlag;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_results")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lab_order_id", nullable = false)
    private Long labOrderId;

    @Column(name = "result_value")
    private String resultValue;

    @Column(name = "reference_range")
    private String referenceRange;

    private String unit;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ResultFlag flag = ResultFlag.NORMAL;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    @PrePersist
    public void prePersist() {
        if (resultDate == null) resultDate = LocalDateTime.now();
    }
}
