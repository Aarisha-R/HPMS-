package com.hospital.hpms.repository;

import com.hospital.hpms.entity.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabResultRepository extends JpaRepository<LabResult, Long> {
    List<LabResult> findByLabOrderId(Long labOrderId);
    List<LabResult> findByFlag(com.hospital.hpms.entity.enums.ResultFlag flag);
}
