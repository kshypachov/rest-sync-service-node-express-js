# Посібник з встановлення сервісу вручну

## Опис
Цей посібник допоможе пройти процесс встановлення сервісу вручну. Для почтаку потрібно мати чисту систему Ubuntu,
всі необхідні пакети та репозиторії будуть підключені пізніше.

## Загальні вимоги

- Node js 20.14.0+
- Git (для клонування репозиторію)
- MariaDB 10.5+
- Ubuntu Server 24.04 - рекомендована ОС для розгортання серверу.

## Встановлення сервісу
### 1. Встановлення залежностей
Для початку потрібно встановити всі необхідні пакети. Виконайте наступні команди для встановлення NodeJs і супутніх інструментів:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - 
sudo apt-get update
sudo apt-get install -y curl libmariadb-dev gcc nodejs git
```

### 2. Встановлення MariaDB
#### Налаштування репозиторію MariaDB
Щоб встановити MariaDB версії 10.5 або вище, потрібно додати офіційний репозиторій:
```bash
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
```
#### Встановлення MariaDB сервера
```bash
sudo apt-get update
sudo apt-get install -y mariadb-server
```
#### Запуск і додавання MariaDB в автозапуск
Запустіть та додайте MariaDB до автозапуску:
```bash
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

#### Перевірка статусу MariaDB
Перевірте, чи працює MariaDB:
```bash
sudo systemctl start mariadb
```
Якщо базу даних запущено, можна рухатись до наступних кроків.
В інакшому випадку потрібно перевірити чи не буде зроблено помилку в одному з попередніх кроків.

### 3. Створення бази даних і користувача

1. Увійдіть у консоль MariaDB
```bash
sudo mysql
```

2. Створіть базу даних, замінивши your_db_name на бажану назву бази даних:
```sql
CREATE DATABASE IF NOT EXISTS your_db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Створіть користувача, замінивши your_db_user та your_db_password на ваші значення:
```sql
CREATE USER IF NOT EXISTS 'your_db_user'@'%' IDENTIFIED BY 'your_db_password';
```

4. Надайте користувачу повні права на базу даних, замінивши your_db_user на ваше значення:
```sql
GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_db_user'@'%';
```

5. Примусово оновіть привілеї:
```sql
FLUSH PRIVILEGES;
```
Тепер у вас є база даних та користувач, і можна рухатися до налаштування та запуску сервісу.

### 4. Клонування репозиторію

1. Клонуйте репозиторій проєкту:
```bash
git clone https://github.com/kshypachov/rest-sync-service-node-express-js.git
```

2.	Перейдіть до директорії проєкту:
```bash
cd rest-sync-service-node-express-js
```

3. Встановіть залежності Node.js
```bash
npm install
```

### 5. Конфігурування сервісу
#### Редагування конфігураційних файлів

Створіть конфігураційний файл ```.env``` 
```ini
# Налаштування сервісу
PORT=3000
 
# Налаштування бази даних
DB_HOST=127.0.0.1
DB_USER=user
DB_NAME=js_db
DB_PASSWORD=pass
 
# Налаштування логування
LOG_LEVEL='debug'
LOG_DIRECTORY='./logs'
ERROR_LOG_FILE_NAME='error.log'
COMBINED_LOG_FILE_NAME='combined.log'
```

- Приклад файлу ```.env```
  ```ini
    # Налаштування сервісу
    PORT=3000 # Порт, на якому буде запущено сервер
    
    # Налаштування бази даних
    DB_HOST=10.0.20.242 # Хост бази даних
    DB_USER=service # Ім'я користувача для підключення до бази даних
    DB_NAME=ua_register # Назва бази даних
    DB_PASSWORD=1111 # Пароль для підключення до бази даних
    
    # Налаштування логування
    LOG_LEVEL='debug' # Рівень логування (info, debug, error і т.д.)
    LOG_DIRECTORY='./logs' # Директорія для збереження лог-файлів
    ERROR_LOG_FILE_NAME='error.log' # Назва файлу для збереження логів помилок
    COMBINED_LOG_FILE_NAME='combined.log' # Назва файлу для збереження об'єднаних логів
  ```

### 6. Створення структури бази даних

1. Застосуйте міграції для створення структури бази даних:
```bash
npx sequelize db:migrate
```

### 7. Налаштування та запуск сервісу як systemd-сервіс
Перевірте за допомогою команди `pwd` що ви знаходитесь у директорії `rest-sync-service-node-express-js`.
Створіть systemd unit-файл для запуску сервісу:

```bash
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
```

#### Перезапуск systemd та запуск сервісу

1.	Перезавантажте конфігурацію systemd:
```bash
sudo systemctl daemon-reload
```

2.	Запустіть сервіс:
```bash
sudo systemctl start rest-sync-service-node-express-js
```

3. Додайте сервіс до автозапуску:
```bash
sudo systemctl enable est-sync-service-node-express-js
```

4.	Перевірте статус сервісу:
```bash
sudo systemctl status est-sync-service-node-express-js
```

### 8. Логування та моніторинг
Для перевірки логів сервісу використовуйте команду:
```bash
journalctl -u est-sync-service-node-express-js -f
```
Також сервіс пиши лог файл, його розташування вказане у конфігураційному файлі `.env`

#### Завершення
Сервіс запущено! Після запуску сервера ви можете отримати доступ до автоматичної документації API за адресою:

- Swagger UI: http://[адреса серверу]:3000/api-docs