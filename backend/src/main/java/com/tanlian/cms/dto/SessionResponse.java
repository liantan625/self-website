package com.tanlian.cms.dto;

public record SessionResponse(boolean authenticated, String username) {

  public static SessionResponse anonymous() {
    return new SessionResponse(false, null);
  }

  public static SessionResponse authenticated(String username) {
    return new SessionResponse(true, username);
  }
}
