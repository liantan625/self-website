package com.tanlian.cms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record BlogPostResponse(
    String slug,
    String title,
    @JsonFormat(pattern = "yyyy-MM-dd") LocalDate date,
    String excerpt,
    List<String> tags,
    boolean draft,
    String body,
    String source,
    Instant updatedAt) {}
