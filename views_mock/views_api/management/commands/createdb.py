from django.core.management.base import BaseCommand
from django.conf import settings

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
        print(f"Creating {NAME}")

        db = MySQLdb.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            port=PORT,
        )
        c = db.cursor()
        c.execute(f"CREATE DATABASE {NAME}")
        print("created database")
