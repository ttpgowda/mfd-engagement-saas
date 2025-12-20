provider "aws" {
  region = "ap-south-1"
}

# 1. Find the latest Ubuntu 22.04 Image automatically
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Official Ubuntu)
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 2. Create Security Group (Firewall)
resource "aws_security_group" "app_sg" {
  name        = "wealthweb-sg"
  description = "Allow SSH and HTTP traffic"

  ingress { # SSH
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For tighter security, replace 0.0.0.0/0 with your home IP
  }

  ingress { # Spring Boot App
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress { # Allow server to reach the internet (for updates)
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Upload your local SSH public key to AWS
resource "aws_key_pair" "deployer" {
  key_name   = "wealthweb-key"
  public_key = file("~/.ssh/aws_key.pub") # Ensure you ran the ssh-keygen command in Phase 1
}

# 4. Create the Server
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.small" # 2GB RAM. t2.micro (1GB) is risky for Java+Postgres.
  key_name      = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  root_block_device {
    volume_size = 20 # 20GB Storage
  }

  # This script runs automatically when the server turns on for the first time
  user_data = <<-EOF
              #!/bin/bash
              # Install Docker & Docker Compose
              apt-get update
              apt-get install -y ca-certificates curl gnupg
              install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              # Allow 'ubuntu' user to run docker without sudo
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "TheWealthWeb-Server"
  }
}

output "public_ip" {
  value = aws_instance.app_server.public_ip
}