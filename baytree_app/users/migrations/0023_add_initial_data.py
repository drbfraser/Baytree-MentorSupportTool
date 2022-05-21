# Adapted from https://docs.djangoproject.com/en/1.8/topics/migrations/#data-migrations

from django.db import models, migrations


def insert_mentor_roles(apps, schema_editor):
    # We can't import the model directly as it may be a newer
    # version than this migration expects. We use the historical version.
    MentorRole = apps.get_model("users", "MentorRole")

    mr1 = MentorRole(
        name="Youth Mentoring",
    )
    mr1.save()

    mr2 = MentorRole(name="Into School Mentoring")
    mr2.save()

    mr3 = MentorRole(name="Womens's Mentoring")
    mr3.save()


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0022_mentorrole"),
    ]

    operations = [
        migrations.RunPython(insert_mentor_roles),
    ]
