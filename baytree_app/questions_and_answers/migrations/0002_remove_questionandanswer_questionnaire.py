# Generated by Django 3.2.11 on 2022-06-01 06:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions_and_answers', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionandanswer',
            name='questionnaire',
        ),
    ]
