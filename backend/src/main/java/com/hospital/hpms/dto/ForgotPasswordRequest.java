package com.hospital.hpms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "Email, username, or staff ID is required")
    private String identifier;
}
