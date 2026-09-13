package com.jobshield.backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobshield.backend.dto.ForgotPasswordRequest;
import com.jobshield.backend.dto.LoginRequest;
import com.jobshield.backend.dto.LoginResponse;
import com.jobshield.backend.dto.RegisterRequest;
import com.jobshield.backend.dto.ResetPasswordRequest;
import com.jobshield.backend.entity.PasswordResetToken;
import com.jobshield.backend.entity.User;
import com.jobshield.backend.repository.PasswordResetTokenRepository;
import com.jobshield.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            PasswordResetTokenRepository passwordResetTokenRepository,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    // ================= REGISTER =================

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName(),
                request.getEmail(),
                hashedPassword
        );

        userRepository.save(user);

        return "User registered successfully";
    }

    // ================= LOGIN =================

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        String token =
                jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                "Login successful",
                token,
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    // ================= FORGOT PASSWORD =================

    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        /*
         * Do not reveal whether an email is registered.
         * This prevents email/account enumeration.
         */
        if (user == null) {
            return "If the email is registered, a password reset link has been sent.";
        }

        // Delete any previous reset token
        passwordResetTokenRepository.deleteByUser(user);

        // Generate secure random token
        String token = UUID.randomUUID().toString();

        // Token valid for 15 minutes
        LocalDateTime expiryDate =
                LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken =
                new PasswordResetToken(
                        token,
                        user,
                        expiryDate
                );

        passwordResetTokenRepository.save(resetToken);

        /*
         * Frontend reset page
         */
        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + token;

        try {

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    resetLink
            );

        } catch (Exception e) {

            // Remove token if email could not be sent
            passwordResetTokenRepository.delete(resetToken);

            throw new RuntimeException(
                    "Unable to send password reset email"
            );
        }

        return "If the email is registered, a password reset link has been sent.";
    }

    // ================= RESET PASSWORD =================

    public String resetPassword(ResetPasswordRequest request) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.getToken())
                        .orElse(null);

        if (resetToken == null) {
            return "Invalid reset token";
        }

        // Check token expiry
        if (resetToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            return "Reset token has expired";
        }

        // Password validation
        if (request.getNewPassword() == null
                || request.getNewPassword().length() < 8) {

            return "Password must be at least 8 characters";
        }

        User user = resetToken.getUser();

        // Hash new password
        String hashedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        user.setPassword(hashedPassword);

        userRepository.save(user);

        // Token can only be used once
        passwordResetTokenRepository.delete(resetToken);

        return "Password reset successfully";
    }
}
