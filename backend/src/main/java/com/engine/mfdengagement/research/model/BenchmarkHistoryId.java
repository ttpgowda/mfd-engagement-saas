package com.engine.mfdengagement.research.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BenchmarkHistoryId implements Serializable {
    private Long benchmarkCode;
    private LocalDate navDate;
}
