package com.hospital.hpms.controller;

import com.hospital.hpms.entity.Notification;
import com.hospital.hpms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> forUser(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getForUser(userId));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(Map.of("unread", notificationService.getUnreadCount(userId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }

    @PostMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Void> markAllRead(@PathVariable Long userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.noContent().build();
    }
}
