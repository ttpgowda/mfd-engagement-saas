# NGINIX setup

### 1. Create a Subdomain

```aiignore
Create a Subdomain: Go to your DNS provider (where you bought thewealthweb.in) and create an A Record:

Name: api (so it becomes api.thewealthweb.in)

Value: 52.66.249.82 (Your AWS IP)
```

### 0. Log in to your server:
```aiignore
ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82
```

### 2. Install Nginx on your AWS Server Nginx will sit in front of your Java app, handle the SSL security, and pass traffic to port 8080.
```aiignore
Run these commands on your server:
# 1. Install Nginx
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# 2. Create Config
sudo nano /etc/nginx/sites-available/api.thewealthweb.in
```

### 3. Paste this configuration: (Replace the domain with your actual new subdomain)
```aiignore
server {
    server_name api.thewealthweb.in;

    location / {
        proxy_pass http://localhost:8080; # Send to Spring Boot
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

Press Ctrl + X, then Y, then Enter to save.
```

### 4. Activate and Secure it:
```aiignore
# Enable the site
sudo ln -s /etc/nginx/sites-available/api.thewealthweb.in /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Get Free SSL (Follow the prompts)
sudo certbot --nginx -d api.thewealthweb.in
```

