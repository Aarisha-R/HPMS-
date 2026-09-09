package com.hospital.hpms.service;

import com.hospital.hpms.entity.Appointment;
import com.hospital.hpms.entity.Notification;
import com.hospital.hpms.entity.enums.AppointmentStatus;
import com.hospital.hpms.entity.enums.NotificationPriority;
import com.hospital.hpms.entity.enums.NotificationType;
import com.hospital.hpms.exception.ResourceNotFoundException;
import com.hospital.hpms.repository.AppointmentRepository;
import com.hospital.hpms.repository.PatientRepository;
import com.hospital.hpms.repository.UserRepository;
import com.hospital.hpms.entity.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public Appointment create(Appointment appointment) {
        if (appointment.getDoctorId() == null || appointment.getDoctorId() <= 0) {
            throw new ResourceNotFoundException("A valid doctor is required for appointment booking");
        }
        userRepository.findById(appointment.getDoctorId())
            .filter(doctor -> doctor.getRole() == Role.DOCTOR && Boolean.TRUE.equals(doctor.getIsActive()))
            .orElseThrow(() -> new ResourceNotFoundException("Selected doctor was not found"));

        var patient = patientRepository.findById(appointment.getPatientId())
            .or(() -> patientRepository.findByUserId(appointment.getPatientId()))
            .orElseThrow(() -> new ResourceNotFoundException("Patient must complete registration before appointment booking"));
        appointment.setPatientId(patient.getId());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        Appointment saved = appointmentRepository.save(appointment);
        String details = saved.getAppointmentDate() + " at " + saved.getTimeSlot();

        notificationService.send(Notification.builder()
            .userId(saved.getDoctorId())
            .message("New appointment scheduled for " + details + ".")
            .type(NotificationType.APPOINTMENT_REMINDER)
            .priority(NotificationPriority.MEDIUM)
            .build());

        if (patient.getUserId() != null) {
            notificationService.send(Notification.builder()
                .userId(patient.getUserId())
                .message("Your appointment is scheduled for " + details + ".")
                .type(NotificationType.APPOINTMENT_REMINDER)
                .priority(NotificationPriority.MEDIUM)
                .build());
        }

        return saved;
    }

    public List<Appointment> getByPatient(Long patientId) {
        Long recordId = patientRepository.findByUserId(patientId).map(patient -> patient.getId()).orElse(patientId);
        return appointmentRepository.findByPatientId(recordId);
    }

    public List<Appointment> getByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    @Transactional
    public Appointment updateStatus(Long id, AppointmentStatus status) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        appt.setStatus(status);
        return appointmentRepository.save(appt);
    }

    @Transactional
    public void cancel(Long id) {
        updateStatus(id, AppointmentStatus.CANCELLED);
    }
}
