# Generated by Django 4.1.3 on 2023-04-12 20:43

from django.db import migrations

session_groups_data = [
    {
        "SessionGroupID": 3,
        "Title": "Literacy Junior",
        "Description": "To provide afterschool support for girls in years 5-6 who need some additional help with academic work",
        "LeadStaff": 12,
        "OtherStaff": None,
    }
]

def migrate_session_groups_data(apps, schema_editor):
    SessionGroup = apps.get_model("views_sessions", "SessionGroup")
    for group in session_groups_data:
        SessionGroup.objects.create(**group)

class Migration(migrations.Migration):

    dependencies = [
        ('views_sessions', '0002_alter_session_sessiongroupid_and_more'),
    ]

    operations = [
        migrations.RunPython(migrate_session_groups_data)
    ]
