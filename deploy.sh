#!/bin/bash
 
# Змінні для конфігурації
REPO_URL="https://github.com/roman-lakhnov/rest-sync-service-node-express-js.git"
PROJECT_DIR="rest-sync-service-node-express-js"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_NAME="your_db_name"
DB_HOST="localhost" # Використовується localhost для встановлення MariaDB на цьому сервері
DB_PORT="3306"      # Порт за замовчуванням для MariaDB
SERVICE_PORT="3000" # Порт, на якому буде запущено сервер
 
# Встановлення системних залежностей
echo "Встановлення системних залежностей..."
sudo apt-get update
sudo apt-get install -y curl libmariadb-dev gcc nodejs npm git
 
# Налаштування репозиторію MariaDB
echo "Налаштування репозиторію MariaDB..."
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
 
# Встановлення MariaDB сервера
echo "Встановлення MariaDB сервера..."
sudo apt-get install -y mariadb-server
 
# Запуск та налаштування MariaDB
echo "Запуск та налаштування MariaDB..."
sudo systemctl start mariadb
sudo systemctl enable mariadb
 
# Створення бази даних та користувача
echo "Створення бази даних та користувача..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';"
sudo mysql -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';"
sudo mysql -e "FLUSH PRIVILEGES;"
 
# Клонування репозиторію
echo "Клонування репозиторію..."
git clone $REPO_URL
cd $PROJECT_DIR
 
# Встановлення залежностей Node.js
echo "Встановлення залежностей Node.js..."
npm install
 
# Створення файлу .env та налаштування змінних середовища
echo "Створення файлу .env та налаштування змінних середовища..."
cat > .env << EOL
# Налаштування сервісу
PORT=$SERVICE_PORT
 
# Налаштування бази даних
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_NAME=$DB_NAME
DB_PASSWORD=$DB_PASSWORD
 
# Налаштування логування
LOG_LEVEL='debug'
LOG_DIRECTORY='./logs'
ERROR_LOG_FILE_NAME='error.log'
COMBINED_LOG_FILE_NAME='combined.log'
EOL
 
# Виконання міграцій бази даних
echo "Виконання міграцій бази даних..."
npx sequelize db:migrate
 
# Створення unit файлу для systemd
echo "Створення unit файлу для systemd..."
sudo bash -c "cat > /etc/systemd/system/rest-sync-service-node-express-js.service" << EOL
[Unit]
Description=Node.js RESTful API Service
After=network.target
 
[Service]
User=$USER
WorkingDirectory=$PWD
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=3
EnvironmentFile=$PWD/.env
 
[Install]
WantedBy=multi-user.target
EOL
 
# Перезапуск systemd та запуск сервісу
echo "Перезапуск systemd та запуск сервісу..."
sudo systemctl daemon-reload
sudo systemctl start rest-sync-service-node-express-js
sudo systemctl enable rest-sync-service-node-express-js
 
echo "Встановлення завершено! Сервіс запущено та додано в автозапуск."
