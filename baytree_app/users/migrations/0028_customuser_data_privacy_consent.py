# Generated by Django 3.2.11 on 2022-05-29 02:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0027_remove_customuser_data_privacy_consent'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='data_privacy_consent',
            field=models.DateTimeField(null=True),
        ),
    ]
