-- for getting bengaluru leads. where mobile field char count >=10 and where they valid
SELECT
	*
FROM
	PUBLIC.AMFI_DISTRIBUTORS
WHERE
	PIN LIKE '560%'
	AND TELEPHONE_O != ''
	AND LENGTH(TELEPHONE_O) >= 10
	AND ARN_VALID_FROM > '2025-04-17'
ORDER BY
	ARN::INTEGER DESC