package com.tanlian.cms.repository;

import com.tanlian.cms.entity.BlogPostEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogPostRepository extends JpaRepository<BlogPostEntity, Long> {

  List<BlogPostEntity> findAllByOrderByPublishDateDescUpdatedAtDesc();

  List<BlogPostEntity> findAllByDraftFalseOrderByPublishDateDescUpdatedAtDesc();

  Optional<BlogPostEntity> findBySlug(String slug);

  Optional<BlogPostEntity> findBySlugAndDraftFalse(String slug);

  boolean existsBySlug(String slug);
}
