package com.tanlian.cms.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "blog_posts",
    uniqueConstraints = {
      @UniqueConstraint(name = "uk_blog_posts_slug", columnNames = "slug")
    })
public class BlogPostEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 160)
  private String slug;

  @Column(nullable = false, length = 255)
  private String title;

  @Column(nullable = false)
  private LocalDate publishDate;

  @Column(nullable = false, length = 2000)
  private String excerpt;

  @Column(nullable = false)
  private boolean draft;

  @Lob
  @Column(nullable = false)
  private String body;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "blog_post_tags", joinColumns = @JoinColumn(name = "post_id"))
  @OrderColumn(name = "tag_order")
  @Column(name = "tag_value", nullable = false, length = 80)
  private List<String> tags = new ArrayList<>();

  @Column(nullable = false, length = 32)
  private String source = "cms";

  @Column(nullable = false)
  private Instant updatedAt = Instant.now();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getSlug() {
    return slug;
  }

  public void setSlug(String slug) {
    this.slug = slug;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public LocalDate getPublishDate() {
    return publishDate;
  }

  public void setPublishDate(LocalDate publishDate) {
    this.publishDate = publishDate;
  }

  public String getExcerpt() {
    return excerpt;
  }

  public void setExcerpt(String excerpt) {
    this.excerpt = excerpt;
  }

  public boolean isDraft() {
    return draft;
  }

  public void setDraft(boolean draft) {
    this.draft = draft;
  }

  public String getBody() {
    return body;
  }

  public void setBody(String body) {
    this.body = body;
  }

  public List<String> getTags() {
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }

  public String getSource() {
    return source;
  }

  public void setSource(String source) {
    this.source = source;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}
