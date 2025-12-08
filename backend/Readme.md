Tool Name,  Complexity, Data Source
Top Performers, Low,    scheme_research (Sort)
Fund Compare,   Low,    scheme_research (Select by ID)
Lumpsum Calc,   Low,    nav_history (Simple Math)
SIP Calc,   Medium,    nav_history (Iterative Math)
Category Monitor,   Low,scheme_research (Group By)
Benchmark Monitor,  Low,    benchmark_analytics

Risk Analyzer,  Low,  scheme_research (Sort by Beta)
Consistency Finder, Low, scheme_research (Filter by Alpha)
Drawdown Checker,   Low,   scheme_research (Sort by MDD)

Rolling Returns,    Medium, nav_history (Time Series)



//requirement
default: we load one prominent category data.
there we show them option of scheme categories
we load the data based on selected category and high return schemes order.
it is need to be paginated/sortable backend frontend combination.

there we show the category average and if this category's banchmark there in our project means we 
will show that one. ofter the category average

in the page need to show Data as on - latest nav date rg. 05-12-2025
and we have to show
return_1y
return_3y
return_5y
return_10y
return_inception/or we have mutual fund data from 2006/04/01. you use all
and the page need to be descriptioned.
for reffrence i attach files.


// Fund Compare requirement.
Mutual Fund Returns Comparison

reffer this link. https://www.mfonline.co.in/mutual-funds-research/mutual-funds-performance-comparison

here we need to compare the fund: 
user select the category and there can select upto 5 as reffred above link we need to fetch data and show here as we did for top-performing
use full url it is better to be seo friendly,

make more advaced and better. if graphs also preffred
in the page need to show Data as on - latest nav date rg. 05-12-2025
and we have to show
it is need to be paginated/sortable backend frontend combination.
there can remove the option and add schemes upto 5
default load one scheme


    // Top performing lumpsum funds
    refer this link: https://www.mfonline.co.in/mutual-funds-research/top-performing-lumpsum-funds
    
    make more advanced and better. if graphs also preferred
    in the page need to show Data as on - latest nav date rg. 05-12-2025
    and we have to show
    it is need to be paginated/sortable/searchable backend frontend combination.
    
    user need to select Select Category, 
    user select Select Period
    <select id="sel_period" class="form-control selectpicker" data-width="100%">
    <option value="1">1 Year</option>
    <option value="2">2 Years</option>
    <option value="3">3 Years</option>
    <option value="4">4 Years</option>
    <option selected="'selected'" value="5">5 Years</option>
    <option value="6">6 Years</option>
    <option value="7">7 Years</option>
    <option value="8">8 Years</option>
    <option value="9">9 Years</option>
    <option value="10">10 Years</option>
    <option value="11">11 Years</option>
    <option value="12">12 Years</option>
    <option value="13">13 Years</option>
    <option value="14">14 Years</option>
    <option value="15">15 Years</option>
    <option value="16">16 Years</option>
    <option value="17">17 Years</option>
    <option value="18">18 Years</option>
    <option value="19">19 Years</option>
    <option value="20">20 Years</option>
    <option value="21">21 Years</option>
    <option value="22">22 Years</option>
    </select>
    
    if have better period selection option use that approach here.
    and they enter the amount.
    
    Select Amount
    
    <select id="sel_sip_amount" onchange="onSipParameterChange()" class="form-control selectpicker" data-width="100%">              
      <option selected="'selected'" value="10000">10000</option>
      <option value="25000">25000</option>
      <option value="50000">50000</option>
      <option value="100000">100000</option>
      <option value="200000">200000</option>
      <option value="300000">300000</option>
      <option value="500000">500000</option>
      <option value="1000000">1000000</option>
      <option value="1500000">1500000</option>
      <option value="2500000">2500000</option>
    </select>
    
    as this way. if have more better way. please use that approach.
    
    you show as better way to visualize make order by current value desc.


## PowerShell Command for getting project tree structure
(Get-ChildItem -Recurse -Force | Where-Object { $_.FullName -notmatch '(target|\.idea|\.mvn)' }).FullName | Out-File backend_structure.txt


## for postgress table create strcutre dump
& "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres -d amfi_db --schema-only > schema.sql