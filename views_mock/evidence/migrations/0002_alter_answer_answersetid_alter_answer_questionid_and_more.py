# Generated by Django 4.1.3 on 2023-03-21 06:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('evidence', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='AnswerSetID',
            field=models.ForeignKey(db_column='AnswerSetID', on_delete=django.db.models.deletion.CASCADE, to='evidence.answerset'),
        ),
        migrations.AlterField(
            model_name='answer',
            name='QuestionID',
            field=models.ForeignKey(db_column='QuestionID', on_delete=django.db.models.deletion.CASCADE, to='evidence.question'),
        ),
        migrations.AlterField(
            model_name='answerset',
            name='QuestionID',
            field=models.ForeignKey(db_column='QuestionID', on_delete=django.db.models.deletion.CASCADE, to='evidence.question'),
        ),
        migrations.AlterField(
            model_name='question',
            name='QuestionnaireID',
            field=models.ForeignKey(db_column='QuestionnaireID', on_delete=django.db.models.deletion.CASCADE, to='evidence.questionnaire'),
        ),
    ]
