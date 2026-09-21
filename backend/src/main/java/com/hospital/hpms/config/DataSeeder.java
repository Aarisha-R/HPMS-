package com.hospital.hpms.config;

import com.hospital.hpms.entity.*;
import com.hospital.hpms.entity.enums.*;
import com.hospital.hpms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds departments, one user per role, a ward/beds, and a demo patient with
 * an appointment so the app has visible data on first run — useful for demos
 * and viva/evaluation walkthroughs. Safe to delete for a from-scratch DB.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PatientRepository patientRepository;
    private final WardRepository wardRepository;
    private final BedRepository bedRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() > 0) {
                        ensureGeneralWard();
            return; // already seeded
        }

        Department admin = departmentRepository.save(Department.builder()
                .departmentName("Administration").departmentType(DepartmentType.ADMIN)
                .floorNumber(1).totalBedCapacity(0).build());

        Department cardiology = departmentRepository.save(Department.builder()
                .departmentName("Cardiology").departmentType(DepartmentType.OPD)
                .floorNumber(2).totalBedCapacity(20).build());

        Department icu = departmentRepository.save(Department.builder()
                .departmentName("ICU").departmentType(DepartmentType.ICU)
                .floorNumber(3).totalBedCapacity(10).build());

        User adminUser = userRepository.save(User.builder()
                .username("admin").email("admin@hpms.local")
                .passwordHash(passwordEncoder.encode("Admin@12345"))
                .role(Role.ADMIN).staffId("ADM-00001").departmentId(admin.getId())
                .isActive(true).build());

        User doctor = userRepository.save(User.builder()
                .username("drmehta").email("drmehta@hpms.local")
                .passwordHash(passwordEncoder.encode("Doctor@12345"))
                .role(Role.DOCTOR).staffId("DOC-00001").departmentId(cardiology.getId())
                .isActive(true).build());

        userRepository.save(User.builder()
                .username("nursepriya").email("priya@hpms.local")
                .passwordHash(passwordEncoder.encode("Nurse@12345"))
                .role(Role.NURSE).staffId("NUR-00001").departmentId(icu.getId())
                .isActive(true).build());

        userRepository.save(User.builder()
                .username("frontdesk").email("frontdesk@hpms.local")
                .passwordHash(passwordEncoder.encode("Desk@12345"))
                .role(Role.RECEPTIONIST).staffId("REC-00001").departmentId(admin.getId())
                .isActive(true).build());

        userRepository.save(User.builder()
                .username("pharmacist1").email("pharma@hpms.local")
                .passwordHash(passwordEncoder.encode("Pharma@12345"))
                .role(Role.PHARMACIST).staffId("PHA-00001").isActive(true).build());

        userRepository.save(User.builder()
                .username("labtech1").email("labtech@hpms.local")
                .passwordHash(passwordEncoder.encode("Lab@12345"))
                .role(Role.LAB_TECHNICIAN).staffId("LAB-00001").isActive(true).build());

        User patientUser = userRepository.save(User.builder()
                .username("ananya").email("ananya@hpms.local")
                .passwordHash(passwordEncoder.encode("Patient@12345"))
                .role(Role.PATIENT).isActive(true).build());

        Patient patient = patientRepository.save(Patient.builder()
                .userId(patientUser.getId())
                .patientNumber("HPMS-100234").name("Ananya Rao")
                .dateOfBirth("1994-03-12").gender(Gender.FEMALE)
                .bloodGroup(BloodGroup.O_POS).phoneNumber("9876543210")
                .address("12 MG Road, Coimbatore").emergencyContactName("Ravi Rao")
                .emergencyContactPhone("9876500000").status(PatientStatus.ACTIVE)
                .build());

        Ward icuWard = wardRepository.save(Ward.builder()
                .wardName("ICU Ward 1").wardType(WardType.ICU)
                .totalBeds(10).occupiedBeds(0).departmentId(icu.getId())
                .floorNumber(3).build());

        for (int i = 1; i <= 5; i++) {
            bedRepository.save(Bed.builder()
                    .wardId(icuWard.getId()).bedNumber("ICU-" + i)
                    .bedType(BedType.ICU).status(BedStatus.AVAILABLE).build());
        }

        createGeneralWard(cardiology.getId());

        appointmentRepository.save(Appointment.builder()
                .patientId(patient.getId()).doctorId(doctor.getId())
                .departmentId(cardiology.getId())
                .appointmentDate(java.time.LocalDate.now().plusDays(1))
                .timeSlot(java.time.LocalTime.of(10, 30))
                .appointmentType(AppointmentType.OPD)
                .status(AppointmentStatus.SCHEDULED)
                .chiefComplaint("Routine cardiac checkup").build());

        System.out.println("=================================================================");
        System.out.println(" HPMS demo data seeded. Login credentials:");
        System.out.println(" Admin        -> admin        / Admin@12345");
        System.out.println(" Doctor       -> drmehta      / Doctor@12345");
        System.out.println(" Nurse        -> nursepriya   / Nurse@12345");
        System.out.println(" Receptionist -> frontdesk    / Desk@12345");
        System.out.println(" Pharmacist   -> pharmacist1  / Pharma@12345");
        System.out.println(" Lab Tech     -> labtech1     / Lab@12345");
        System.out.println(" Patient      -> ananya       / Patient@12345");
        System.out.println("=================================================================");
    }

        private void ensureGeneralWard() {
                boolean exists = wardRepository.findAll().stream()
                                .anyMatch(ward -> ward.getWardType() == WardType.GENERAL);
                if (!exists) {
                        createGeneralWard(null);
                }
        }

        private void createGeneralWard(Long departmentId) {
                Ward generalWard = wardRepository.save(Ward.builder()
                                .wardName("General Ward 1").wardType(WardType.GENERAL)
                                .totalBeds(10).occupiedBeds(0).departmentId(departmentId)
                                .floorNumber(2).build());

                for (int i = 1; i <= 10; i++) {
                        bedRepository.save(Bed.builder()
                                        .wardId(generalWard.getId()).bedNumber("GEN-" + i)
                                        .bedType(BedType.GENERAL).status(BedStatus.AVAILABLE).build());
                }
        }
}

