# Generated by Django 3.2.7 on 2021-11-27 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monthly_reports', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestionAndResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=500)),
                ('answer', models.CharField(max_length=500)),
            ],
        ),
        migrations.DeleteModel(
            name='QA',
        ),
        migrations.AddField(
            model_name='monthlyreport',
            name='question_and_answer_list',
            field=models.ManyToManyField(to='monthly_reports.QuestionAndResponse'),
        ),
    ]
