# Generated by Django 3.2.11 on 2022-06-21 06:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0008_alter_goal_mentor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='creation_date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
