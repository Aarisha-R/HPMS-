package com.hospital.hpms.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Applied to all AES-256 Encrypted PHI attributes identified in the DB design
 * (Patients.name, date_of_birth, phone_number, address, insurance_id).
 */
@Converter
public class PhiAttributeConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String attribute) {
        AesEncryptor enc = PhiConverterSupport.getEncryptor();
        if (enc == null || attribute == null) return attribute;
        return enc.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        AesEncryptor enc = PhiConverterSupport.getEncryptor();
        if (enc == null || dbData == null) return dbData;
        try {
            return enc.decrypt(dbData);
        } catch (Exception e) {
            // Data written before encryption was wired up, or plain seed data
            return dbData;
        }
    }
}
