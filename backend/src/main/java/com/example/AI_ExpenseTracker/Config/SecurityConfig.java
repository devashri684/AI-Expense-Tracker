package com.example.AI_ExpenseTracker.Config;

//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http
//                .csrf(csrf -> csrf.disable())   // 🔥 VERY IMPORTANT
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()   // allow all requests
//                );
//
//        return http.build();
//    }
//}





import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {}) // Simplified CORS handling without extra imports
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for REST API POST/PUT/DELETE requests
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() // Allow unauthenticated access to all API routes
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}