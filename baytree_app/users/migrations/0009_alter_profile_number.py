# Generated by Django 3.2.7 on 2021-10-20 01:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_auto_20211020_0129'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='number',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
