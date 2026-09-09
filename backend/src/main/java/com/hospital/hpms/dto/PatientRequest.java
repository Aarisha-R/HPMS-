package com.hospital.hpms.dto;

import com.hospital.hpms.entity.enums.BloodGroup;
import com.hospital.hpms.entity.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PatientRequest {

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[A-Za-z ]{2,100}$", message = "Name must not contain special characters or numbers")
    private String name;

    @NotBlank(message = "Date of birth is required")
    private String dateOfBirth; // ISO yyyy-MM-dd, validated as past date in service

    @NotNull
    private Gender gender;

    private BloodGroup bloodGroup;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone Number must be exactly 10 digits")
    private String phoneNumber;

    private String address;

    private String emergencyContactName;

    @Pattern(regexp = "^\\d{10}$|^$", message = "Emergency contact phone must be exactly 10 digits")
    private String emergencyContactPhone;

    @Size(max = 50, message = "Invalid insurance ID format")
    private String insuranceId;
}
