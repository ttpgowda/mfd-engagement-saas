## 1. (free -h        # check memory) (top / htop     # CPU usage) (df -h          # disk)

```aiignore
ssh -o StrictHostKeyChecking=no -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82 " free -h; top -bn1 | head -n 20; df -h"
```
## 2. Container restart.
```aiignore
1. ssh -i "C:/Users/Hi/.ssh/aws_key" ubuntu@52.66.249.82
2. docker update --restart=unless-stopped $(docker ps -q)
```


