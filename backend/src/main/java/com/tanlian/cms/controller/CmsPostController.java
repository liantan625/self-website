package com.tanlian.cms.controller;

import com.tanlian.cms.dto.BlogPostRequest;
import com.tanlian.cms.dto.BlogPostResponse;
import com.tanlian.cms.service.BlogPostService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/cms/posts")
public class CmsPostController {

  private final BlogPostService blogPostService;

  public CmsPostController(BlogPostService blogPostService) {
    this.blogPostService = blogPostService;
  }

  @GetMapping
  public List<BlogPostResponse> getCmsPosts(@RequestParam(defaultValue = "true") boolean includeDrafts) {
    return blogPostService.getCmsPosts(includeDrafts);
  }

  @GetMapping("/{slug}")
  public BlogPostResponse getCmsPost(@PathVariable String slug) {
    return blogPostService.getCmsPost(slug);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BlogPostResponse createPost(@Valid @RequestBody BlogPostRequest request) {
    return blogPostService.createPost(request);
  }

  @PutMapping("/{slug}")
  public BlogPostResponse updatePost(@PathVariable String slug, @Valid @RequestBody BlogPostRequest request) {
    return blogPostService.updatePost(slug, request);
  }

  @DeleteMapping("/{slug}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deletePost(@PathVariable String slug) {
    blogPostService.deletePost(slug);
  }
}
