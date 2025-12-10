package com.engine.mfdengagement.template.repository;

import com.engine.mfdengagement.template.entity.Template;
import com.engine.mfdengagement.template.entity.TemplateCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {

    List<Template> findByIsPublicTrue();

    List<Template> findByCategory(TemplateCategory category);

    List<Template> findByCategoryAndIsPublicTrue(TemplateCategory category);

    List<Template> findByNameContainingIgnoreCase(String name);
}
