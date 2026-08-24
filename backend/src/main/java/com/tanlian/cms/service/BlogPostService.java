package com.tanlian.cms.service;

import com.tanlian.cms.dto.BlogPostRequest;
import com.tanlian.cms.dto.BlogPostResponse;
import com.tanlian.cms.entity.BlogPostEntity;
import com.tanlian.cms.repository.BlogPostRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BlogPostService {

  private final BlogPostRepository blogPostRepository;

  public BlogPostService(BlogPostRepository blogPostRepository) {
    this.blogPostRepository = blogPostRepository;
  }

  @Transactional(readOnly = true)
  public List<BlogPostResponse> getPublishedPosts() {
    return blogPostRepository.findAllByDraftFalseOrderByPublishDateDescUpdatedAtDesc()
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public BlogPostResponse getPublishedPost(String slug) {
    BlogPostEntity post = blogPostRepository.findBySlugAndDraftFalse(slug)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
    return toResponse(post);
  }

  @Transactional(readOnly = true)
  public List<BlogPostResponse> getCmsPosts(boolean includeDrafts) {
    List<BlogPostEntity> posts = includeDrafts
        ? blogPostRepository.findAllByOrderByPublishDateDescUpdatedAtDesc()
        : blogPostRepository.findAllByDraftFalseOrderByPublishDateDescUpdatedAtDesc();

    return posts.stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public BlogPostResponse getCmsPost(String slug) {
    BlogPostEntity post = blogPostRepository.findBySlug(slug)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
    return toResponse(post);
  }

  @Transactional
  public BlogPostResponse createPost(BlogPostRequest request) {
    String slug = resolveSlug(request.getSlug(), request.getTitle());
    if (blogPostRepository.existsBySlug(slug)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "A CMS post already uses that slug.");
    }

    BlogPostEntity entity = applyRequest(new BlogPostEntity(), request, slug);
    return toResponse(blogPostRepository.save(entity));
  }

  @Transactional
  public BlogPostResponse updatePost(String existingSlug, BlogPostRequest request) {
    BlogPostEntity existing = blogPostRepository.findBySlug(existingSlug)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));

    String nextSlug = resolveSlug(request.getSlug(), request.getTitle());
    if (!existing.getSlug().equals(nextSlug) && blogPostRepository.existsBySlug(nextSlug)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "A CMS post already uses that slug.");
    }

    BlogPostEntity saved = blogPostRepository.save(applyRequest(existing, request, nextSlug));
    return toResponse(saved);
  }

  @Transactional
  public void deletePost(String slug) {
    BlogPostEntity existing = blogPostRepository.findBySlug(slug)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found."));
    blogPostRepository.delete(existing);
  }

  private BlogPostEntity applyRequest(BlogPostEntity entity, BlogPostRequest request, String slug) {
    entity.setSlug(slug);
    entity.setTitle(request.getTitle().trim());
    entity.setPublishDate(request.getDate());
    entity.setExcerpt(request.getExcerpt().trim());
    entity.setDraft(request.isDraft());
    entity.setBody(request.getBody().trim());
    entity.setTags(normalizeTags(request.getTags()));
    entity.setSource("cms");
    entity.setUpdatedAt(Instant.now());
    return entity;
  }

  private List<String> normalizeTags(List<String> tags) {
    if (tags == null || tags.isEmpty()) {
      return new ArrayList<>();
    }

    LinkedHashSet<String> uniqueTags = new LinkedHashSet<>();
    for (String tag : tags) {
      if (tag == null) {
        continue;
      }

      String trimmed = tag.trim();
      if (!trimmed.isEmpty()) {
        uniqueTags.add(trimmed);
      }
    }

    return new ArrayList<>(uniqueTags);
  }

  private String resolveSlug(String rawSlug, String title) {
    String basis = Optional.ofNullable(rawSlug).filter(value -> !value.isBlank()).orElse(title);
    String slug = basis
        .toLowerCase(Locale.ROOT)
        .trim()
        .replaceAll("[^a-z0-9]+", "-")
        .replaceAll("^-+|-+$", "");

    if (slug.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug must contain at least one letter or number.");
    }

    return slug;
  }

  private BlogPostResponse toResponse(BlogPostEntity entity) {
    return new BlogPostResponse(
        entity.getSlug(),
        entity.getTitle(),
        entity.getPublishDate(),
        entity.getExcerpt(),
        List.copyOf(entity.getTags()),
        entity.isDraft(),
        entity.getBody(),
        entity.getSource(),
        entity.getUpdatedAt());
  }
}
