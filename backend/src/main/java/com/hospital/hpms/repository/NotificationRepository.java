package com.hospital.hpms.repository;

import com.hospital.hpms.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedDateDesc(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);
}
