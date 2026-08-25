package com.tanlian.cms.controller;

import com.tanlian.cms.dto.LoginRequest;
import com.tanlian.cms.dto.SessionResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;

  public AuthController(AuthenticationManager authenticationManager) {
    this.authenticationManager = authenticationManager;
  }

  @GetMapping("/session")
  public SessionResponse getSession(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
      return SessionResponse.anonymous();
    }

    return SessionResponse.authenticated(authentication.getName());
  }

  @PostMapping("/login")
  public SessionResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
    try {
      Authentication authentication = authenticationManager.authenticate(
          UsernamePasswordAuthenticationToken.unauthenticated(request.getUsername(), request.getPassword()));

      SecurityContext context = SecurityContextHolder.createEmptyContext();
      context.setAuthentication(authentication);
      SecurityContextHolder.setContext(context);

      HttpSession session = httpRequest.getSession(true);
      session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

      return SessionResponse.authenticated(authentication.getName());
    } catch (BadCredentialsException error) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
    }
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
    new SecurityContextLogoutHandler().logout(request, response, authentication);
  }
}
