1) For Linux: install mysql server and library
sudo apt install \
  libmysqlclient-dev \
  mysql-server \
  mysql-client \

  For Windows: use the MySQL Community installer to install MySQL Server, WorkBench, and the Python Connector
  https://dev.mysql.com/downloads/windows/installer/8.0.html
  
2) install python library
pip3 install -r requirements.txt

3) initialize mysql database
create database Baytree default character set 'utf8';
CREATE USER 'Baytree'@'localhost' IDENTIFIED BY 'Baytree123';
GRANT ALL PRIVILEGES ON Baytree.* TO 'Baytree'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES

4) make migrations
python3 manage.py makemigrations sessions
python3 manage.py migrate

5) create superuser
python3 manage.py createsuperuser
    (enter your email and password)

6) follow the instructions in the .env.example file
    
7) start django
python3 manage.py runserver

8) visit admin site
http://127.0.0.1:8000/admin/ 
enter superuser credentials in step 5

