-- Table: public.scheme_master

-- DROP TABLE IF EXISTS public.scheme_master;

CREATE TABLE IF NOT EXISTS public.scheme_master
(
    "schemeCode" bigint NOT NULL,
    "schemeName" character varying(255) COLLATE pg_catalog."default",
    is_tracked boolean,
    is_backfilled boolean,
    fund_house character varying(255) COLLATE pg_catalog."default",
    scheme_category character varying(255) COLLATE pg_catalog."default",
    isin_growth character varying(255) COLLATE pg_catalog."default",
    isin_div_reinvestment character varying(255) COLLATE pg_catalog."default",
    benchmark_code bigint,
    CONSTRAINT pk_scheme_master PRIMARY KEY ("schemeCode"),
    CONSTRAINT fk_scheme_benchmark FOREIGN KEY (benchmark_code)
        REFERENCES public.benchmark_master (benchmark_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.scheme_master
    OWNER to postgres;



-- Table: public.nav_history

-- DROP TABLE IF EXISTS public.nav_history;

CREATE TABLE IF NOT EXISTS public.nav_history
(
    scheme_code bigint,
    nav_date date,
    nav_value double precision,
    CONSTRAINT unique_scheme_date UNIQUE (scheme_code, nav_date)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.nav_history
    OWNER to postgres;


-- Table: public.scheme_analytics

-- DROP TABLE IF EXISTS public.scheme_analytics;

CREATE TABLE IF NOT EXISTS public.scheme_analytics
(
    scheme_code bigint NOT NULL,
    last_updated date,
    nav_current numeric(38,2),
    return_1y numeric(38,2),
    return_3y numeric(38,2),
    return_5y numeric(38,2),
    return_inception numeric(38,2),
    std_dev numeric(38,2),
    sharpe_ratio numeric(38,2),
    std_dev_1y numeric(38,2),
    std_dev_3y numeric(38,2),
    std_dev_5y numeric(38,2),
    CONSTRAINT scheme_analytics_pkey PRIMARY KEY (scheme_code),
    CONSTRAINT fk_analytics_scheme FOREIGN KEY (scheme_code)
        REFERENCES public.scheme_master ("schemeCode") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.scheme_analytics
    OWNER to postgres;
	
	

-- Table: public.scheme_research

-- DROP TABLE IF EXISTS public.scheme_research;

CREATE TABLE IF NOT EXISTS public.scheme_research
(
    scheme_code bigint NOT NULL,
    benchmark_code bigint,
    last_updated date,
    alpha_3y numeric(10,2),
    beta_3y numeric(10,2),
    r_squared_3y numeric(10,2),
    sortino_3y numeric(10,2),
    upside_capture_3y numeric(10,2),
    downside_capture_3y numeric(10,2),
    treynor_ratio_3y numeric(10,2),
    info_ratio_3y numeric(10,2),
    tracking_error_3y numeric(10,2),
    max_drawdown_3y numeric(10,2),
    best_month_3y numeric(10,2),
    worst_month_3y numeric(10,2),
    return_ytd numeric(10,2),
    return_2024 numeric(10,2),
    return_2023 numeric(10,2),
    return_2022 numeric(10,2),
    return_2021 numeric(10,2),
    return_2020 numeric(10,2),
    return_1m numeric(10,2),
    return_6m numeric(10,2),
    CONSTRAINT scheme_research_pkey PRIMARY KEY (scheme_code),
    CONSTRAINT fk_research_scheme FOREIGN KEY (scheme_code)
        REFERENCES public.scheme_master ("schemeCode") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.scheme_research
    OWNER to postgres;

COMMENT ON COLUMN public.scheme_research.alpha_3y
    IS 'Excess return over benchmark (Skill)';

COMMENT ON COLUMN public.scheme_research.beta_3y
    IS 'Volatility relative to benchmark';

COMMENT ON COLUMN public.scheme_research.info_ratio_3y
    IS 'Consistency of outperformance';

COMMENT ON COLUMN public.scheme_research.max_drawdown_3y
    IS 'Max % drop from peak to trough';
	
	


	
-- Table: public.benchmark_master

-- DROP TABLE IF EXISTS public.benchmark_master;

CREATE TABLE IF NOT EXISTS public.benchmark_master
(
    benchmark_code bigint NOT NULL,
    benchmark_name character varying(255) COLLATE pg_catalog."default",
    nse_symbol character varying(255) COLLATE pg_catalog."default",
    yahoo_ticker character varying(255) COLLATE pg_catalog."default",
    category_mapping character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT pk_benchmark_master PRIMARY KEY (benchmark_code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.benchmark_master
    OWNER to postgres;
	
	
-- Table: public.benchmark_history

-- DROP TABLE IF EXISTS public.benchmark_history;

CREATE TABLE IF NOT EXISTS public.benchmark_history
(
    benchmark_code bigint,
    nav_date date,
    close_value numeric(38,2),
    CONSTRAINT unique_benchmark_date UNIQUE (benchmark_code, nav_date),
    CONSTRAINT fk_history_benchmark FOREIGN KEY (benchmark_code)
        REFERENCES public.benchmark_master (benchmark_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.benchmark_history
    OWNER to postgres;
	

-- Table: public.benchmark_analytics

-- DROP TABLE IF EXISTS public.benchmark_analytics;

CREATE TABLE IF NOT EXISTS public.benchmark_analytics
(
    benchmark_code bigint NOT NULL,
    last_updated date,
    close_current numeric(38,2),
    return_1y numeric(38,2),
    return_3y numeric(38,2),
    return_5y numeric(38,2),
    return_inception numeric(38,2),
    std_dev numeric(38,2),
    sharpe_ratio numeric(38,2),
    std_dev_1y numeric(38,2),
    std_dev_3y numeric(38,2),
    std_dev_5y numeric(38,2),
    CONSTRAINT benchmark_analytics_pkey PRIMARY KEY (benchmark_code),
    CONSTRAINT fk_analytics_benchmark FOREIGN KEY (benchmark_code)
        REFERENCES public.benchmark_master (benchmark_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.benchmark_analytics
    OWNER to postgres;