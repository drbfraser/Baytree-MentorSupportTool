# Generated by Django 4.1.3 on 2023-03-21 04:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Questionnaire',
            fields=[
                ('QuestionnaireID', models.AutoField(primary_key=True, serialize=False)),
                ('Title', models.CharField(max_length=100)),
                ('Description', models.TextField()),
                ('Created', models.DateTimeField(auto_now_add=True)),
                ('Updated', models.DateTimeField(auto_now=True)),
                ('CreatedBy', models.CharField(max_length=50)),
                ('UpdatedBy', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('QuestionID', models.AutoField(primary_key=True, serialize=False)),
                ('SourceID', models.IntegerField()),
                ('Question', models.CharField(max_length=500)),
                ('valueListID', models.IntegerField()),
                ('inputType', models.CharField(max_length=50)),
                ('validation', models.CharField(max_length=100)),
                ('category', models.CharField(max_length=50)),
                ('enabled', models.IntegerField()),
                ('QuestionnaireID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evidence.questionnaire')),
            ],
        ),
        migrations.CreateModel(
            name='AnswerSet',
            fields=[
                ('AnswerSetID', models.AutoField(primary_key=True, serialize=False)),
                ('EntityType', models.CharField(max_length=100)),
                ('EntityID', models.IntegerField()),
                ('Date', models.DateTimeField(auto_now_add=True)),
                ('QuestionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evidence.question')),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('AnswerID', models.AutoField(primary_key=True, serialize=False)),
                ('Answer', models.CharField(max_length=1000)),
                ('AnswerSetID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evidence.answerset')),
                ('QuestionID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evidence.question')),
                ('QuestionnaireID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='evidence.questionnaire')),
            ],
        ),
    ]