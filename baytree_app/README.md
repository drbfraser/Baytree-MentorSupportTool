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

