1) install mysql server and library
sudo apt install \
  libmysqlclient-dev \
  mysql-server \
  mysql-client 
  
2) install python library
pip3 install -i requirements.txt

3) initialize mysql database
create database Baytree default character set 'utf8';
grant all privileges on Baytree.* to 'Baytree'@localhost identified by 'Baytree123';

4) make migrations
python3 manage.py makemigrations sessions
python3 manage.py migrate

5) create superuser
python3 manage.py createsuperuser
    (enter your email and password)
    
6) start django
python3 manage.py runserver

7) visit admin site
http://127.0.0.1:8000/admin/ 
enter superuser credentials in step 5

