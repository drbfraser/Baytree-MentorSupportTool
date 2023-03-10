from django.core.management.base import BaseCommand
from django.conf import settings
import os
import MySQLdb

class Command(BaseCommand):
    help = "Create database"

    def handle(self, *args, **kwatgs):
        db_config = settings.DATABASES["default"]
        HOST = db_config["HOST"]
        USER = db_config["USER"]
        PASSWORD = db_config["PASSWORD"]
        PORT = db_config["PORT"]
        NAME = db_config["NAME"]


        db = MySQLdb.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            port=PORT,
        )
        c = db.cursor()
        c.execute("SHOW DATABASES")
        databases = c.fetchall()

        db_exists = False
        for database in databases:
          if database[0] == os.environ["MOCK_MYSQL_DATABASE"]:
              db_exists = True
              break
        if not db_exists:
          c.execute(f"CREATE DATABASE {NAME}")
          print("{NAME} successfully created")
