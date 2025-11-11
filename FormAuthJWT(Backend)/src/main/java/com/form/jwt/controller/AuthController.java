package com.form.jwt.controller;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.form.jwt.entity.User;
import com.form.jwt.repository.UserRepository;
import com.form.jwt.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            String token = jwtUtil.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token format"));
        }
        String token = authHeader.substring(7);
        try {
            
            String username = jwtUtil.extractUsername(token);
            if (jwtUtil.validateToken(token, username)) {
                return ResponseEntity.ok(Map.of("valid", true, "username", username));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired token"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token parsing failed"));
        }
    }
}
