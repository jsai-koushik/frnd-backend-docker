package com.example.demo.dto.auth;

import com.example.demo.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;

public class RegisterRequest {

    @Schema(example = "Ravi")
    private String name;

    @Schema(example = "ravi@gmail.com")
    private String email;

    @Schema(example = "Ravi@123")
    private String password;

    @Schema(example = "CANDIDATE")
    private Role role;

    public RegisterRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}