# i10jan Herokuサーバ
This application was created for the [i10jan](https://github.com/smpny7/i10jan-kotlin) server.

# Getting Started
Install the latest docker from the link below and need [Docker Compose](https://github.com/docker/compose).

|   SERVER   |                       LINK                       |
|  :------:  | :----------------------------------------------: |
|   CentOS   |  https://docs.docker.com/engine/install/centos/  |
|   Debian   |  https://docs.docker.com/engine/install/debian/  |
|   Fedora   |  https://docs.docker.com/engine/install/fedora/  |
|  Raspbian  |  https://docs.docker.com/engine/install/debian/  |
|   Ubuntu   |  https://docs.docker.com/engine/install/ubuntu/  |

# Usage

```
# Clone repository
git clone https://github.com/smpny7/i10jan-api.git

# Change current directory
cd i10jan-api

# Set environment variables as you like
mv .env.sample .env & vi .env

# Start the container
docker-compose up -d
```