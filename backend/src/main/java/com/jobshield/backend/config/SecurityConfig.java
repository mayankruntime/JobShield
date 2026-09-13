package com.jobshield.backend.config;

import com.jobshield.backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

            // Disable CSRF because we are using JWT authentication
            .csrf(csrf -> csrf.disable())


            // Enable CORS configuration
            .cors(cors -> {})


            // JWT based authentication = stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )


            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // Public authentication endpoints
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/forgot-password",
                    "/api/auth/reset-password"
                ).permitAll()


                // Public health endpoint
                .requestMatchers(
                    "/api/health"
                ).permitAll()


                // Everything else requires authentication
                .anyRequest().authenticated()
            )


            // JWT filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }
}