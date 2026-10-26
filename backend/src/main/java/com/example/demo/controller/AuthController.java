
package com.example.demo.controller;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(
        name = "Authentication",
        description = "Registration and login APIs"
)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ==========================================
    // REGISTER CANDIDATE OR RECRUITER
    // ==========================================

    @PostMapping("/register")
    @Operation(
            summary = "Register user",
            description = "Creates a new candidate or recruiter account"
    )
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity.ok(
                user.getRole().name() +
                " registered successfully"
        );
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    @Operation(
            summary = "Login",
            description = "Authenticates the user and returns their ID, JWT token, name, email and role"
    )
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }
}
