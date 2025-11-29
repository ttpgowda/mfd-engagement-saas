package com.engine.mfdengagement.lead.repository;

import com.engine.mfdengagement.lead.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
}

// 1. give it what resource it is going to take to win. the nex 3months. to make this one more reliable and perfect.