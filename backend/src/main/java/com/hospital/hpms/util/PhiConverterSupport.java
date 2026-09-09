package com.hospital.hpms.util;

/**
 * Holds a static reference to the Spring-managed AesEncryptor so that
 * JPA AttributeConverters (which are instantiated by Hibernate, not Spring)
 * can still perform field-level AES-256 encryption/decryption.
 * Wired in HpmsApplication via a @PostConstruct in SpringContext-style bean below.
 */
public class PhiConverterSupport {
    private static AesEncryptor encryptor;

    public static void setEncryptor(AesEncryptor enc) {
        encryptor = enc;
    }

    public static AesEncryptor getEncryptor() {
        return encryptor;
    }
}
