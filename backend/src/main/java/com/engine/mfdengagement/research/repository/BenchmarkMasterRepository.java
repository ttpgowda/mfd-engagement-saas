package com.engine.mfdengagement.research.repository;

import com.engine.mfdengagement.research.model.BenchmarkMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BenchmarkMasterRepository extends JpaRepository<BenchmarkMaster, Long> { }