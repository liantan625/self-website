package com.tanlian.cms.controller;

import com.tanlian.cms.dto.BlogPostResponse;
import com.tanlian.cms.service.BlogPostService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class PublicPostController {

  private final BlogPostService blogPostService;

  public PublicPostController(BlogPostService blogPostService) {
    this.blogPostService = blogPostService;
  }

  @GetMapping
  public List<BlogPostResponse> getPublishedPosts() {
    return blogPostService.getPublishedPosts();
  }

  @GetMapping("/{slug}")
  public BlogPostResponse getPublishedPost(@PathVariable String slug) {
    return blogPostService.getPublishedPost(slug);
  }
}
