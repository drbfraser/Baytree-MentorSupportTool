# Generated by Django 3.2.11 on 2022-03-22 00:28

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0005_alter_goal_mentee'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='last_update_date',
            field=models.DateTimeField(auto_now=True),
        ),
    ]