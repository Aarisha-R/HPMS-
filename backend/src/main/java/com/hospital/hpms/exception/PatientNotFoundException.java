package com.hospital.hpms.exception;

public class PatientNotFoundException extends RuntimeException {
    public PatientNotFoundException(String message) { super(message); }
}
