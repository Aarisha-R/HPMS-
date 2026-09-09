package com.hospital.hpms.service;

import com.hospital.hpms.entity.Bed;
import com.hospital.hpms.entity.Ward;
import com.hospital.hpms.entity.enums.BedStatus;
import com.hospital.hpms.exception.ResourceNotFoundException;
import com.hospital.hpms.repository.BedRepository;
import com.hospital.hpms.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WardBedService {

    private final WardRepository wardRepository;
    private final BedRepository bedRepository;

    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }

    @Transactional
    public Ward createWard(Ward ward) {
        return wardRepository.save(ward);
    }

    public List<Bed> getBedsByWard(Long wardId) {
        return bedRepository.findByWardId(wardId);
    }

    public List<Bed> getAvailableBeds() {
        return bedRepository.findByStatus(BedStatus.AVAILABLE);
    }

    @Transactional
    public Bed createBed(Bed bed) {
        bed.setStatus(BedStatus.AVAILABLE);
        return bedRepository.save(bed);
    }

    @Transactional
    public Bed assignBed(Long bedId, Long patientId) {
        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found"));
        if (bed.getStatus() != BedStatus.AVAILABLE) {
            throw new IllegalStateException("Bed is not available for assignment");
        }
        bed.setPatientId(patientId);
        bed.setStatus(BedStatus.OCCUPIED);
        bed.setAssignmentDate(LocalDateTime.now());

        Ward ward = wardRepository.findById(bed.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found"));
        ward.setOccupiedBeds((ward.getOccupiedBeds() == null ? 0 : ward.getOccupiedBeds()) + 1);
        wardRepository.save(ward);

        return bedRepository.save(bed);
    }

    @Transactional
    public Bed dischargeBed(Long bedId) {
        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found"));
        bed.setPatientId(null);
        bed.setStatus(BedStatus.AVAILABLE);

        Ward ward = wardRepository.findById(bed.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found"));
        ward.setOccupiedBeds(Math.max(0, (ward.getOccupiedBeds() == null ? 0 : ward.getOccupiedBeds()) - 1));
        wardRepository.save(ward);

        return bedRepository.save(bed);
    }
}
