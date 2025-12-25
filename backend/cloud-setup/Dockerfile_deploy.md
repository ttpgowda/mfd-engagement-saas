Step 1: Create the app folder on the server

```aiignore
ssh -o StrictHostKeyChecking=no -i "C:/Users/Hi/.ssh/aws_key" ubuntu@65.1.112.141 "mkdir -p ~/app"
```

Step 2: Upload your JAR file

```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" target/*.jar ubuntu@65.1.112.141:~/app/app.jar
```

Step 3: Upload Config Files
```aiignore
scp -i "C:/Users/Hi/.ssh/aws_key" Dockerfile docker-compose.yml .env ubuntu@65.1.112.141:~/app/
```

Step 4: Start the Application
```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@15.207.55.7
```

Bash
```aiignore
cd ~/app
sudo docker compose up -d --build
```


free -h        # check memory
top / htop     # CPU usage
df -h          # disk
