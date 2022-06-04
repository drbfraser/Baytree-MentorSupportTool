# Generated by Django 3.2.11 on 2022-05-27 03:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('questionnaires', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionnaire',
            name='mentee',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='questionnaire_mentee', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='questionnaire',
            name='mentor',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='questionnaire_mentor', to=settings.AUTH_USER_MODEL),
        ),
    ]
