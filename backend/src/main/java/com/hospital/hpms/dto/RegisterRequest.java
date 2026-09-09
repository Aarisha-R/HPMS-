package com.hospital.hpms.dto;

import com.hospital.hpms.entity.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Please enter a valid email address")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Password must meet security requirements")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$",
        message = "Password must meet security requirements"
    )
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    private Long departmentId;


    private String staffId; // required for non-PATIENT roles, validated in service

    private String specialization; // required for DOCTOR roles, validated in service
}
