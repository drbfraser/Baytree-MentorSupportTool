# Generated by Django 3.2.11 on 2022-07-15 03:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goals', '0011_auto_20220712_2347'),
    ]

    operations = [
        migrations.AddField(
            model_name='goal',
            name='mentee_id',
            field=models.IntegerField(null=True),
        ),
    ]