# Generated by Django 3.2.7 on 2021-11-27 22:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('monthly_report', '0003_auto_20211127_2250'),
    ]

    operations = [
        migrations.AlterField(
            model_name='monthlyreport',
            name='question_and_response_list',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='QARs_in_monthly_report', to='monthly_report.questionandresponse'),
        ),
    ]
