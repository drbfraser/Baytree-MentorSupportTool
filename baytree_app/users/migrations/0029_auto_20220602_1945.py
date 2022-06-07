# Generated by Django 3.2.11 on 2022-06-03 02:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0028_customuser_data_privacy_consent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='data_privacy_consent',
        ),
        migrations.AddField(
            model_name='mentoruser',
            name='data_privacy_consent',
            field=models.DateTimeField(null=True),
        ),
    ]