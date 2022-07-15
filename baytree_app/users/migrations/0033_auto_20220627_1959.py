# Generated by Django 3.2.11 on 2022-06-28 02:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0032_alter_mentoruser_mentorrole'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mentorrole',
            name='activity',
        ),
        migrations.CreateModel(
            name='MentorRoleActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity', models.CharField(default='', max_length=150)),
                ('mentorRole', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.mentorrole')),
            ],
        ),
    ]