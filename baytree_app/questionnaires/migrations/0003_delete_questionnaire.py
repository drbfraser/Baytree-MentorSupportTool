# Generated by Django 3.2.11 on 2022-06-01 06:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions_and_answers', '0002_remove_questionandanswer_questionnaire'),
        ('questionnaires', '0002_auto_20220526_2040'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Questionnaire',
        ),
    ]
