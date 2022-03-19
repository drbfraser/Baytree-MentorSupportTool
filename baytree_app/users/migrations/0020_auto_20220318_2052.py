# Generated by Django 3.2.11 on 2022-03-19 03:52

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0019_accountcreationlink'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='accountcreationlink',
            name='id',
        ),
        migrations.AlterField(
            model_name='accountcreationlink',
            name='linkId',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
