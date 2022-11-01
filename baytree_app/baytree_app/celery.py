import os
from celery import Celery
from celery.schedules import crontab

# configuration for celery
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "baytree_app.settings")
app = Celery("baytree_app")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# tasks to be run on a schedule
app.conf.beat_schedule = {
    "store-active-mentors-every-hour": {
        "task": "store_active_mentors",
        "schedule": crontab(hour = 1),
        "args": []
    }
}

