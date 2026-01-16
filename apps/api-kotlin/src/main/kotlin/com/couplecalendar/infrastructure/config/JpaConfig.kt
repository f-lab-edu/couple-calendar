package com.couplecalendar.infrastructure.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@EnableJpaRepositories(basePackages = ["com.couplecalendar.infrastructure.persistence.repository"])
class JpaConfig
