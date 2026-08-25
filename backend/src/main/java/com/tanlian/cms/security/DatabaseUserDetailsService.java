package com.tanlian.cms.security;

import com.tanlian.cms.entity.UserEntity;
import com.tanlian.cms.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public DatabaseUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserEntity user = userRepository
        .findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Invalid username or password."));

    return User.withUsername(user.getUsername())
        .password(user.getPasswordHash())
        .roles(user.getRole())
        .disabled(!user.isEnabled())
        .build();
  }
}
