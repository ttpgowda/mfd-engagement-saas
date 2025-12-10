package com.engine.mfdengagement.template.service;

import com.engine.mfdengagement.template.dto.TemplateDTO;
import com.engine.mfdengagement.template.entity.Template;
import com.engine.mfdengagement.template.entity.TemplateCategory;
import com.engine.mfdengagement.template.repository.TemplateRepository;
import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final TenantRepository tenantRepository;

    private static final String UPLOAD_DIR = "uploads/templates/";

    public TemplateDTO createTemplate(TemplateDTO dto) {
        Template template = new Template();
        template.setName(dto.getName());
        template.setDescription(dto.getDescription());
        template.setCategory(dto.getCategory());
        template.setSubCategory(dto.getSubCategory());
        template.setTemplateData(dto.getTemplateData());
        template.setLogoUrl(dto.getLogoUrl());
        template.setIsPublic(dto.getIsPublic() != null ? dto.getIsPublic() : false);

        // Customization fields
        template.setCompanyName(dto.getCompanyName());
        template.setPhone(dto.getPhone());
        template.setEmail(dto.getEmail());
        template.setWebsite(dto.getWebsite());
        template.setAddress(dto.getAddress());

        // Design customization
        template.setPrimaryColor(dto.getPrimaryColor());
        template.setSecondaryColor(dto.getSecondaryColor());
        template.setFontFamily(dto.getFontFamily());
        template.setPreviewImageUrl(dto.getPreviewImageUrl());

        String tenantId = com.engine.mfdengagement.tenant.config.TenantContext.getTenantId();
        Tenant tenant = tenantRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        template.setTenant(tenant);

        Template savedTemplate = templateRepository.save(template);
        return mapToDTO(savedTemplate);
    }

    public List<TemplateDTO> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TemplateDTO getTemplateById(@NonNull Long id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        return mapToDTO(template);
    }

    public TemplateDTO updateTemplate(@NonNull Long id, TemplateDTO dto) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        template.setName(dto.getName());
        template.setDescription(dto.getDescription());
        template.setCategory(dto.getCategory());
        template.setSubCategory(dto.getSubCategory());
        template.setTemplateData(dto.getTemplateData());
        template.setIsPublic(dto.getIsPublic());

        // Customization fields
        template.setCompanyName(dto.getCompanyName());
        template.setPhone(dto.getPhone());
        template.setEmail(dto.getEmail());
        template.setWebsite(dto.getWebsite());
        template.setAddress(dto.getAddress());

        // Design customization
        template.setPrimaryColor(dto.getPrimaryColor());
        template.setSecondaryColor(dto.getSecondaryColor());
        template.setFontFamily(dto.getFontFamily());
        template.setPreviewImageUrl(dto.getPreviewImageUrl());

        Template updatedTemplate = templateRepository.save(template);
        return mapToDTO(updatedTemplate);
    }

    public void deleteTemplate(@NonNull Long id) {
        templateRepository.deleteById(id);
    }

    public List<TemplateDTO> getPublicTemplates() {
        return templateRepository.findByIsPublicTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TemplateDTO> getTemplatesByCategory(TemplateCategory category) {
        return templateRepository.findByCategory(category).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TemplateDTO> searchTemplates(String query) {
        return templateRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public String uploadLogo(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/templates/" + filename;
    }

    private TemplateDTO mapToDTO(Template template) {
        return TemplateDTO.builder()
                .id(template.getId())
                .name(template.getName())
                .description(template.getDescription())
                .category(template.getCategory())
                .subCategory(template.getSubCategory())
                .templateData(template.getTemplateData())
                .logoUrl(template.getLogoUrl())
                .isPublic(template.getIsPublic())
                .companyName(template.getCompanyName())
                .phone(template.getPhone())
                .email(template.getEmail())
                .website(template.getWebsite())
                .address(template.getAddress())
                .primaryColor(template.getPrimaryColor())
                .secondaryColor(template.getSecondaryColor())
                .fontFamily(template.getFontFamily())
                .previewImageUrl(template.getPreviewImageUrl())
                .build();
    }
}
