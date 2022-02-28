# Generated by Django 3.2.11 on 2022-02-27 07:25

from django.db import migrations

def add_notification_types(apps, schema_editor):
    # We can't import the Person model directly as it may be a newer
    # version than this migration expects. We use the historical version.
    NotificationType = apps.get_model('notifications', 'NotificationType')
    mentees_progress_questionnaire = NotificationType(
        title="Mentee's Progress Questionnaire Pending to Complete", 
        content="Please complete the progress questionnaire for all your mentees.", 
        type="MONTHLY",
        period_in_days=30)
    mentees_progress_questionnaire.save()

class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_notification_types),
    ]