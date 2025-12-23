Option 1: Direct Dump (Fastest)
```aiignore
& "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -h 52.66.249.82 -p 5432 -U postgres -d amfi_db -f server_backup.sql --clean --if-exists
```

Option 2: Docker Method (If Option 1 fails)
    If the firewall blocks the connection, run this command to generate the dump inside the server and save it locally using SSH.
```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 "sudo docker exec mfd_postgres pg_dump -U postgres -d amfi_db --clean --if-exists" > server_backup_docker.sql
```