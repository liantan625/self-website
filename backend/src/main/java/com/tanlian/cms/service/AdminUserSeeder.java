package com.tanlian.cms.service;

import com.tanlian.cms.entity.UserEntity;
import com.tanlian.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserSeeder implements ApplicationRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final String adminUsername;
  private final String adminPassword;

  public AdminUserSeeder(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      @Value("${app.security.admin.username}") String adminUsername,
      @Value("${app.security.admin.password}") String adminPassword) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.adminUsername = adminUsername;
    this.adminPassword = adminPassword;
  }

  @Override
  public void run(ApplicationArguments args) {
    userRepository.findByUsername(adminUsername).orElseGet(() -> {
      UserEntity user = new UserEntity();
      user.setUsername(adminUsername);
      user.setPasswordHash(passwordEncoder.encode(adminPassword));
      user.setRole("CMS_ADMIN");
      user.setEnabled(true);
      return userRepository.save(user);
    });
  }
}
