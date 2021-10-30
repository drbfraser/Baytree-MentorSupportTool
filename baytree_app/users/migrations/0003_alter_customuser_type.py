# Generated by Django 3.2.7 on 2021-10-20 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20211019_2343'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='type',
            field=models.CharField(choices=[('ADMIN', 'Admin'), ('MENTOR', 'Mentor'), ('MENTEE', 'Mentee')], default='MENTOR', max_length=50, verbose_name='Type'),
        ),
    ]
