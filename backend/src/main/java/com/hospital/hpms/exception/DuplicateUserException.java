package com.hospital.hpms.exception;

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) { super(message); }
}
