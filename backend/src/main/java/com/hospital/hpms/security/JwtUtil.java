package com.hospital.hpms.security;

import com.hospital.hpms.entity.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * JWT issuance/validation per SRS Appendix D: role-specific token expirations,
 * HS256 signing, and role claim embedding for downstream authorization.
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long patientExpirationMs;
    private final long staffExpirationMs;
    private final long adminExpirationMs;

    public JwtUtil(@Value("${hpms.jwt.secret}") String secret,
                    @Value("${hpms.jwt.expiration-patient-ms}") long patientExpirationMs,
                    @Value("${hpms.jwt.expiration-staff-ms}") long staffExpirationMs,
                    @Value("${hpms.jwt.expiration-admin-ms}") long adminExpirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.patientExpirationMs = patientExpirationMs;
        this.staffExpirationMs = staffExpirationMs;
        this.adminExpirationMs = adminExpirationMs;
    }

    public String generateToken(Long userId, String username, Role role) {
        long expiration = switch (role) {
            case PATIENT -> patientExpirationMs;
            case ADMIN -> adminExpirationMs;
            default -> staffExpirationMs;
        };
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(Map.of("userId", userId, "role", role.name()))
                .subject(username)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
