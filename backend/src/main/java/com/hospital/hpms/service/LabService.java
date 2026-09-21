package com.hospital.hpms.service;

import com.hospital.hpms.entity.LabOrder;
import com.hospital.hpms.entity.LabResult;
import com.hospital.hpms.entity.enums.LabOrderStatus;
import com.hospital.hpms.entity.enums.ResultFlag;
import com.hospital.hpms.exception.ResourceNotFoundException;
import com.hospital.hpms.repository.LabOrderRepository;
import com.hospital.hpms.repository.LabResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LabService {

    private final LabOrderRepository labOrderRepository;
    private final LabResultRepository labResultRepository;

    @Transactional
    public LabOrder createOrder(LabOrder order) {
        order.setStatus(LabOrderStatus.ORDERED);
        return labOrderRepository.save(order);
    }

    public List<LabOrder> getOrdersByPatient(Long patientId) {
        return labOrderRepository.findByPatientId(patientId);
    }

    public List<LabOrder> getPendingOrders() {
        return labOrderRepository.findAll().stream()
                .filter(o -> o.getStatus() != LabOrderStatus.COMPLETED && o.getStatus() != LabOrderStatus.CANCELLED)
                .toList();
    }

    @Transactional
    public LabOrder updateStatus(Long orderId, LabOrderStatus status) {
        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab order not found"));
        if (status != LabOrderStatus.COLLECTED && status != LabOrderStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Only COLLECTED and IN_PROGRESS statuses can be set manually");
        }
        order.setStatus(status);
        return labOrderRepository.save(order);
    }

    @Transactional
    public LabResult enterResult(Long orderId, LabResult result) {
        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab order not found"));
        result.setLabOrderId(orderId);
        LabResult saved = labResultRepository.save(result);

        order.setStatus(LabOrderStatus.COMPLETED);
        order.setResultDate(LocalDateTime.now());
        labOrderRepository.save(order);

        return saved;
    }

    public List<LabResult> getCriticalValues() {
        return labResultRepository.findByFlag(ResultFlag.CRITICAL);
    }
}
