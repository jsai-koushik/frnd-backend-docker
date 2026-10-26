package com.example.demo.config;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail =
                    "admin@smarthire.com";

            if (userRepository
                    .findByEmail(adminEmail)
                    .isEmpty()) {

                User admin = new User();

                admin.setName("SmartHire Admin");

                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode(
                                "Admin@123"
                        )
                );

                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println(
                        "======================================"
                );

                System.out.println(
                        "SmartHire Admin created successfully"
                );

                System.out.println(
                        "Email: admin@smarthire.com"
                );

                System.out.println(
                        "Password: Admin@123"
                );

                System.out.println(
                        "======================================"
                );

            } else {

                System.out.println(
                        "SmartHire Admin already exists"
                );
            }
        };
    }
}