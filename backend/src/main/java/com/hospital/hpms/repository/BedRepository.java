package com.hospital.hpms.repository;

import com.hospital.hpms.entity.Bed;
import com.hospital.hpms.entity.enums.BedStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByWardId(Long wardId);
    List<Bed> findByStatus(BedStatus status);
}
