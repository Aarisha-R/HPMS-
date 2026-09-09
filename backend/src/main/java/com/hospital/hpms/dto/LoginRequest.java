package com.hospital.hpms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String identifier; // username, email, or staff ID

    @NotBlank
    private String password;
}
