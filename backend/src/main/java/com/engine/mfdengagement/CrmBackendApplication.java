package com.engine.mfdengagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {
		"com.engine.mfdengagement.user.entity",
		"com.engine.mfdengagement.tenant.entity",
		"com.engine.mfdengagement.lead.entity",
		"com.engine.mfdengagement.mutualfund.domain",
		"com.engine.mfdengagement.common.entity"
})
@EnableJpaRepositories(basePackages = {
		"com.engine.mfdengagement.user.repository",
		"com.engine.mfdengagement.tenant.repository",
		"com.engine.mfdengagement.lead.repository",
		"com.engine.mfdengagement.mutualfund.repository"
})
public class CrmBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmBackendApplication.class, args);
	}

}
