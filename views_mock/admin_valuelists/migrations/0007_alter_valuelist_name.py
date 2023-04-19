# Generated by Django 4.1.3 on 2023-04-03 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_valuelists', '0006_alter_valuelist_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='valuelist',
            name='Name',
            field=models.CharField(choices=[('AgencyActivities', 'Agency Activities'), ('Venues', 'Venues'), ('VolunteeringTypes', 'Volunteering Types')], default='AgencyActivities', max_length=50),
        ),
    ]