package com.hospital.hpms.entity;

import com.hospital.hpms.entity.enums.DepartmentType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_name", unique = true, nullable = false)
    private String departmentName;

    @Enumerated(EnumType.STRING)
    @Column(name = "department_type", nullable = false)
    private DepartmentType departmentType;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "head_user_id")
    private Long headUserId;

    @Column(name = "total_bed_capacity")
    private Integer totalBedCapacity;
}
