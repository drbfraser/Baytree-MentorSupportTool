# Generated by Django 3.2.7 on 2021-10-20 01:39

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0009_alter_profile_number'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Profile',
            new_name='MentorProfile',
        ),
    ]
