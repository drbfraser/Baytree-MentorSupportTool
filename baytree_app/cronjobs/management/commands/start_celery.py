from django.core.management.base import BaseCommand
import subprocess

class Command(BaseCommand):
    help = "Start celery worker and beat"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Starting celery worker in detach mode..."))
        subprocess.call([
            "python",
            "-m",
            "celery",
            "-A",
            "baytree_app",
            "worker",
            "-l",
            "info",
            "--logfile",
            "./server_logs/celery.worker.log",
            "--detach"
        ])
        self.stdout.write(self.style.NOTICE("Starting celery beat in detach mode..."))
        subprocess.call([
            "python",
            "-m",
            "celery",
            "-A",
            "baytree_app",
            "beat",
            "-l",
            "info",
            "--logfile",
            "./server_logs/celery.beat.log",
            "--detach"
        ])
