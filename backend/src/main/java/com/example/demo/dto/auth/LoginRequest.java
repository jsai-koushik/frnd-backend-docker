package com.example.demo.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

public class LoginRequest {

    @Schema(example = "ravi@gmail.com")
    private String email;

    @Schema(example = "Ravi@123")
    private String password;

    public LoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}