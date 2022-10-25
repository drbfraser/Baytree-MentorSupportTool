from django.core.management.base import BaseCommand
import subprocess, shlex

class Command(BaseCommand):
    help = "Stop celery worker and beat"

    def handle(self, *args, **kwargs):
        cmd = """
        kill -9 $(ps aux | grep "celery -A baytree_app" | awk '{print $2}' | tr '\n' ' ') > /dev/null 2>&1
        """
        self.stdout.write(self.style.NOTICE("Stopping celery..."))
        subprocess.Popen(cmd.strip(), shell=True)
