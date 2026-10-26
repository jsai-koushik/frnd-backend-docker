
package com.example.demo.controller;

import com.example.demo.dto.auth.AdminApplicationResponse;
import com.example.demo.dto.auth.AdminCandidateResponse;
import com.example.demo.dto.auth.AdminDashboardResponse;
import com.example.demo.dto.auth.AdminJobResponse;
import com.example.demo.dto.auth.AdminRecruiterResponse;
import com.example.demo.dto.auth.AdminUserResponse;
import com.example.demo.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Tag(
        name = "Admin",
        description = "Admin management APIs"
)
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService) {

        this.adminService = adminService;
    }

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Get admin dashboard",
            description = "Returns overall platform statistics"
    )
    public ResponseEntity<AdminDashboardResponse> getDashboard() {

        AdminDashboardResponse response =
                adminService.getDashboard();

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // GET ALL USERS
    // ==========================================

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Get all users",
            description = "Returns all registered users"
    )
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        List<AdminUserResponse> users =
                adminService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    // ==========================================
    // GET ALL CANDIDATES
    // ==========================================

    @GetMapping("/candidates")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Get all candidates",
            description = "Returns all candidates with their profile information"
    )
    public ResponseEntity<List<AdminCandidateResponse>> getAllCandidates() {

        List<AdminCandidateResponse> candidates =
                adminService.getAllCandidates();

        return ResponseEntity.ok(candidates);
    }

    // ==========================================
    // GET ALL RECRUITERS
    // ==========================================

    @GetMapping("/recruiters")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Get all recruiters",
            description = "Returns all recruiters and the number of jobs they have posted"
    )
    public ResponseEntity<List<AdminRecruiterResponse>> getAllRecruiters() {

        List<AdminRecruiterResponse> recruiters =
                adminService.getAllRecruiters();

        return ResponseEntity.ok(recruiters);
    }

    // ==========================================
    // GET ALL JOBS
    // ==========================================

    @GetMapping("/jobs")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Get all jobs",
            description = "Returns all jobs and the recruiter who posted each job"
    )
    public ResponseEntity<List<AdminJobResponse>> getAllJobs() {

        List<AdminJobResponse> jobs =
                adminService.getAllJobs();

        return ResponseEntity.ok(jobs);
    }

    // ==========================================
    // GET ALL APPLICATIONS
    // ==========================================

    @GetMapping("/applications")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Get all applications",
            description = "Returns all job applications with candidate, job, recruiter and status information"
    )
    public ResponseEntity<List<AdminApplicationResponse>> getAllApplications() {

        List<AdminApplicationResponse> applications =
                adminService.getAllApplications();

        return ResponseEntity.ok(applications);
    }

    // ==========================================
    // DELETE USER
    // ==========================================

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Delete user",
            description = "Allows admin to delete a candidate or recruiter"
    )
    public ResponseEntity<String> deleteUser(
            @PathVariable Long userId) {

        adminService.deleteUser(userId);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }

    // ==========================================
    // DELETE JOB
    // ==========================================

    @DeleteMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
            summary = "Delete job",
            description = "Allows admin to delete a job"
    )
    public ResponseEntity<String> deleteJob(
            @PathVariable Long jobId) {

        adminService.deleteJob(jobId);

        return ResponseEntity.ok(
                "Job deleted successfully"
        );
    }
}

