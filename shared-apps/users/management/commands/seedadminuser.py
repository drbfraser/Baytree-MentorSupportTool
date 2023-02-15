# Seed only one admin user
from django.core.management.base import BaseCommand
from users.models import CustomUser
from users.models import AdminUser
import string, secrets


class Command(BaseCommand):
    help = 'Add an admin user to the system with a random password. Must be passed in the email address of the user.'

    def add_arguments(self, parser):
        parser.add_argument('adminEmail', type=str, help='Admin email')

    def handle(self, *args, **options):
        # Generate a random 20 character password
        # Source: https://docs.python.org/3/library/secrets.html#recipes-and-best-practices
        alphabet = string.ascii_letters + string.digits
        password = "".join(
            secrets.choice(alphabet) for i in range(20)
        )  # for a 20-character password

        # Username from arguments
        username = options['adminEmail']

        # Create user
        customUser = CustomUser.objects.create_user(username, password)
        AdminUser.objects.create(user=customUser)

        # Display the password which user must write down.
        self.stdout.write(self.style.SUCCESS("Admin user successfully created!"))
        self.stdout.write(
            self.style.SUCCESS("--> User name set to:         '" + username + "'")
        )
        self.stdout.write(
            self.style.SUCCESS("--> Initial password set to:  '" + password + "'")
        )
        self.stdout.write(
            self.style.SUCCESS(
                "--> You *must* write this password down now! Then log-in and change it."
            )
        )


