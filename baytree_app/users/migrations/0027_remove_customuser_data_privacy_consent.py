# Generated by Django 3.2.11 on 2022-05-29 02:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0026_alter_customuser_data_privacy_consent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='data_privacy_consent',
        ),
    ]
