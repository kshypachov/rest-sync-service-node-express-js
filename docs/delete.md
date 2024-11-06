## Інструкція для видалення проєкту

### 1. Зупинка сервісу
Для початку потрібно зупинити активний сервіс:
```bash
sudo systemctl stop rest-sync-service-node-express-js
```

### 2. Видалення сервісу із автозапуску
Видаліть сервіс з автозапуску:
```bash
sudo systemctl disable rest-sync-service-node-express-js
```

### 3. Видалення systemd unit-файлу
Видаліть файл сервісу, щоб уникнути залишкових слідів у системі:
```bash
sudo rm /etc/systemd/system/rest-sync-service-node-express-js.service
```
Перезавантажте конфігурацію systemd:
```bash
sudo systemctl daemon-reload
```

### 4. Видалення віртуального середовища та файлів проєкту
Перейдіть до директорії, де знаходиться проєкт, і видаліть її:
```bash
cd ..
sudo rm -rf rest-sync-service-node-express-js
```

### 5. Видалення бази даних та користувача
1.	Увійдіть у консоль MariaDB:
```bash
sudo mysql
```
2.	Видаліть базу даних (замініть your_db_name на ім’я вашої бази):
```sql
DROP DATABASE IF EXISTS your_db_name;
```

3.	Видаліть користувача (замініть your_db_user на ім’я користувача):
```sql
DROP USER IF EXISTS 'your_db_user'@'%';
```
4.	Вийдіть із консолі MariaDB:
```sql
exit
```

### 6. Видалення залежностей (опціонально)
```bash
sudo apt-get remove --purge -y curl libmariadb-dev gcc nodejs npm git mariadb-server
sudo apt-get autoremove -y
```

### 7. Перевірка стану
Переконайтеся, що жодних активних процесів чи файлів, пов’язаних із проєктом, більше немає в системі.
