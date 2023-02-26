# Generated by Django 3.2.7 on 2021-10-20 04:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_rename_profile_mentorprofile'),
    ]

    operations = [
        migrations.CreateModel(
            name='MenteeUser',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='users.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='MentorUser',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='users.customuser')),
                ('status', models.CharField(choices=[('Active', 'Active'), ('Withdrawn', 'Withdrawn'), ('On Hold', 'On Hold'), ('Temporarily Withdrawn', 'Temporarily Withdrawn'), ('Future Leaver', 'Future Leaver'), ('Staff', 'Staff'), ('Inactive', 'Inactive')], max_length=30)),
            ],
        ),
        migrations.DeleteModel(
            name='MentorProfile',
        ),
        migrations.AddField(
            model_name='menteeuser',
            name='mentorid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.mentoruser'),
        ),
    ]