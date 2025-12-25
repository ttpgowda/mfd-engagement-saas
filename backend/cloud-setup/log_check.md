Step 1: Check if the App Container is Running

```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 "sudo docker ps"
```

Step 2: Check the Application Logs (Crucial)

```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 "sudo docker logs mfd_backend"
```