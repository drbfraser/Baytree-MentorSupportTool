# Generated by Django 4.1.3 on 2023-02-26 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('views_sessions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='venue_name',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='session',
            name='venue_id',
            field=models.PositiveIntegerField(),
        ),
    ]
