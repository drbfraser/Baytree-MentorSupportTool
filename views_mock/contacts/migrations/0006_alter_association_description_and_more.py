# Generated by Django 4.1.3 on 2023-04-09 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0005_association_master_slave_not_equal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='association',
            name='Description',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='association',
            name='EndDate',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='association',
            name='StartDate',
            field=models.DateField(auto_now_add=True),
        ),
    ]