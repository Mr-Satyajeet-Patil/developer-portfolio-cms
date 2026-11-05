from django.db import migrations

def set_superuser_credentials(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    # Get the first superuser (or all)
    superusers = User.objects.filter(is_superuser=True)
    for u in superusers:
        u.username = 'satyajeet'
        u.set_password('password')
        u.save()

class Migration(migrations.Migration):
    dependencies = [
        ('portfolio', '0002_blogpost_contactmessage_education_experience_project_and_more'),
    ]
    operations = [
        migrations.RunPython(set_superuser_credentials, migrations.RunPython.noop),
    ]

