package com.hospital.hpms.config;

import com.hospital.hpms.util.AesEncryptor;
import com.hospital.hpms.util.PhiConverterSupport;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Wires the Spring-managed AesEncryptor into the static holder used by
 * PhiAttributeConverter, since JPA AttributeConverters are instantiated
 * by Hibernate outside of the Spring container.
 */
@Component
@RequiredArgsConstructor
public class EncryptorBootstrap {

    private final AesEncryptor aesEncryptor;

    @PostConstruct
    public void init() {
        PhiConverterSupport.setEncryptor(aesEncryptor);
    }
}
