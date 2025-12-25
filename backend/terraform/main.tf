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
  vpc_id = "vpc-0012e98b1d988c2da"

  ingress { # SSH
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # HTTP
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # HTTPS
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # Spring Boot App
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # PostgreSQL
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress { # Allow all outbound
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
  instance_type = "t3.medium" # 2GB RAM. t2.micro (1GB) is risky for Java+Postgres.
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


# --- S3 Bucket for Assets ---
resource "aws_s3_bucket" "assets" {
  bucket = "mfd-engagement-assets-${random_id.suffix.hex}" # Ensures global uniqueness
}

resource "random_id" "suffix" {
  byte_length = 4
}

# Disable "Block Public Access" so we can apply a public read policy
resource "aws_s3_bucket_public_access_block" "assets_access" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Policy to allow public READ (so users can see the logos/favicons)
resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.assets.id
  depends_on = [aws_s3_bucket_public_access_block.assets_access]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.assets.arn}/*"
      },
    ]
  })
}

# --- IAM User for Spring Boot Uploads ---
resource "aws_iam_user" "app_user" {
  name = "mfd-app-s3-user"
}

resource "aws_iam_access_key" "app_key" {
  user = aws_iam_user.app_user.name
}

resource "aws_iam_user_policy" "app_upload_policy" {
  name = "MfdAppUploadPolicy"
  user = aws_iam_user.app_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:PutObject", "s3:DeleteObject", "s3:PutObjectAcl"]
        Resource = "${aws_s3_bucket.assets.arn}/*"
      }
    ]
  })
}

# --- Outputs ---
output "s3_bucket_name" {
  value = aws_s3_bucket.assets.id
}

output "s3_access_key" {
  value = aws_iam_access_key.app_key.id
}

output "s3_secret_key" {
  value     = aws_iam_access_key.app_key.secret
  sensitive = true
}