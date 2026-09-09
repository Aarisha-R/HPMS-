package com.hospital.hpms.service;

import com.hospital.hpms.entity.AuditLog;
import com.hospital.hpms.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Central audit trail writer, invoked by controllers/services for
 * PHI access and mutation events per SRS 3.5 and 3.6.3 (HIPAA audit logging).
 */
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(Long userId, String action, String entityType, String entityId, String oldValue, String newValue) {
        AuditLog entry = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .build();
        auditLogRepository.save(entry);
    }

    public List<AuditLog> getAll() {
        return auditLogRepository.findAll();
    }
}
