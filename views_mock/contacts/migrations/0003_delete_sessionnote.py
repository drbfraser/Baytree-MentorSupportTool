# Generated by Django 4.1.3 on 2023-04-07 02:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0002_note_sessionnote_participantnote'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SessionNote',
        ),
    ]