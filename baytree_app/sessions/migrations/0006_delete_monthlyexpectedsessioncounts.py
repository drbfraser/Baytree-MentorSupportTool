# Generated by Django 3.2.11 on 2022-04-15 04:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mentor_sessions', '0005_monthlyexpectedsessioncounts'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MonthlyExpectedSessionCounts',
        ),
    ]
