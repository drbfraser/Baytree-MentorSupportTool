# Generated by Django 4.1.3 on 2023-04-02 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_valuelists', '0004_alter_valuelist_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='valuelist',
            name='Name',
            field=models.CharField(choices=[('agencyactivities', 'Agency Activities'), ('venues', 'Venues'), ('volunteeringtypes', 'Volunteering Types')], max_length=50),
        ),
    ]
