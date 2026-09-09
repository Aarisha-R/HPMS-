package com.hospital.hpms.entity;

import com.hospital.hpms.entity.enums.WardType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ward_name", unique = true, nullable = false)
    private String wardName;

    @Enumerated(EnumType.STRING)
    @Column(name = "ward_type")
    private WardType wardType;

    @Column(name = "total_beds")
    private Integer totalBeds;

    @Column(name = "occupied_beds")
    @Builder.Default
    private Integer occupiedBeds = 0;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "nurse_in_charge")
    private Long nurseInCharge;
}
