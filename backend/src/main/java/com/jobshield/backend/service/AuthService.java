
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

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            PasswordResetTokenRepository passwordResetTokenRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
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

        if (user == null) {
            return "If the email is registered, a reset link will be generated.";
        }

        // Delete old token if it exists
        passwordResetTokenRepository.deleteByUser(user);

        // Generate new token
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

        // Temporary development response
        return "Password reset token: " + token;
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

        if (resetToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            return "Reset token has expired";
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().length() < 6) {

            return "Password must be at least 6 characters";
        }

        User user = resetToken.getUser();

        String hashedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        user.setPassword(hashedPassword);

        userRepository.save(user);

        // Token can be used only once
        passwordResetTokenRepository.delete(resetToken);

        return "Password reset successfully";
    }
}

