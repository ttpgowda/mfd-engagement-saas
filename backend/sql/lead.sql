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



INSERT INTO public.mfd_leads (arn, name, mobile, email, contact_type)
VALUES ('', '', '', '', '');

INSERT INTO public.mfd_lead_remarks (arn, remark)
VALUES ('', '');


SELECT
    arn, arn_holder_name, telephone_o, email
FROM
    public.amfi_distributors
WHERE
    telephone_o LIKE '%9591117095%'  -- told to call Monday
 OR telephone_o LIKE '%9429062267%'  -- told to share details on WhatsApp
 OR telephone_o LIKE '%9945253535%'  -- told to call Jan 3rd
 OR telephone_o LIKE '%9148870472%'  -- told to share details on WhatsApp
 ;

"arn"	"arn_holder_name"	"telephone_o"	"email"
"348231"	"MANPREET SINGH ARORA"	"9591117095"	"manpreet181@gmail.com"
"348253"	"PRADIPKUMAR A PATEL"	"9429062267"	"patel10188@rediffmail.com"
"348324"	"ALYANA RADHARANI"	"9945253535"	"alyana.radharani@gmail.com"
"348387"	"SHOBHAARTH"	"9148870472"	"mihirmajithia9@gmail.com"
INSERT INTO public.mfd_leads (arn, name, mobile, email, contact_type)
VALUES ('348231', 'MANPREET SINGH ARORA', '9591117095', 'manpreet181@gmail.com', 'call'),
VALUES ('348253', 'PRADIPKUMAR A PATEL', '9429062267', 'patel10188@rediffmail.com', 'call'),
VALUES ('348324', 'ALYANA RADHARANI', '9945253535', 'alyana.radharani@gmail.com', 'call'),
VALUES ('348387', 'SHOBHAARTH', '9148870472', 'mihirmajithia9@gmail.com', 'call');

INSERT INTO public.mfd_lead_remarks (arn, remark)
VALUES ('348231', 'told to call Monday'),
VALUES ('348253', 'told to share details on WhatsApp'),
VALUES ('348324', 'told to call Jan 3rd'),
VALUES ('348387', 'told to share details on WhatsApp');
