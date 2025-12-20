## 1. Database Migration (Local → AWS)
### A. Export Local Data Run in Local PowerShell:

```aiignore
# Navigate to project folder
cd C:\thimme\projects\mfd-engagement-saas

# Create a backup file (clean drop & create)
& "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U postgres -h localhost -d mf_db_new -f my_backup.sql --clean --if-exists
```


### B. Upload to AWS Run in Local PowerShell:

```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" my_backup.sql ubuntu@52.66.249.82:~/app/
```

### C. Import on Server Run in Server Terminal (SSH):
```aiignore
# Move file into container
sudo docker cp ~/app/my_backup.sql mfd_postgres:/backup.sql

# Execute restore (Note: We used 'amfi_db' as the target database)
sudo docker exec -i mfd_postgres psql -U postgres -d amfi_db -f /backup.sql
```

## 2. Server Configuration (Docker & Env)

### Docker Compose (docker-compose.yml) Location: ~/app/docker-compose.yml Key

```aiignore
Database Service (db): Exposes port 5432:5432 for external access.

Backend Service (app): Depends on db, exposes port 8080.

Network: Uses app-network to allow containers to talk internally.
```

