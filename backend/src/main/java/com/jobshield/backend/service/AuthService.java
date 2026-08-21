package com.jobshield.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobshield.backend.dto.LoginRequest;
import com.jobshield.backend.dto.LoginResponse;
import com.jobshield.backend.dto.RegisterRequest;
import com.jobshield.backend.entity.User;
import com.jobshield.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

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
}