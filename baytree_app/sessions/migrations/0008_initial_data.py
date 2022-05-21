# Adapted from https://docs.djangoproject.com/en/1.8/topics/migrations/#data-migrations

from django.db import models, migrations


def insert_mentor_roles(apps, schema_editor):
    # We can't import the model directly as it may be a newer
    # version than this migration expects. We use the historical version.
    Activity = apps.get_model("mentor_sessions", "Activity")

    a1 = Activity(name="Youth mentoring")
    a1.save()

    a2 = Activity(name="Into School mentoring")
    a2.save()

    a3 = Activity(name="Womens's support")
    a3.save()


class Migration(migrations.Migration):

    dependencies = [
        ("mentor_sessions", "0007_alter_activity_name"),
    ]

    operations = [
        migrations.RunPython(insert_mentor_roles),
    ]
