# Generated by Django 3.2.11 on 2022-05-29 01:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0021_resetpasswordlink'),
    ]

    operations = [
        migrations.AddField(
            model_name='mentoruser',
            name='dataPrivacyConsent',
            field=models.DateField(default=None),
        ),
    ]
