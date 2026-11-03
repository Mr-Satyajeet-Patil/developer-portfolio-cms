from django.core.management import call_command
from django.core.management.base import BaseCommand

from portfolio.models import Profile


class Command(BaseCommand):
    help = "Load the bundled portfolio content the first time the database is empty."

    def handle(self, *args, **options):
        if Profile.objects.exists():
            self.stdout.write("Portfolio content already exists; skipping seed.")
            return

        call_command("loaddata", "portfolio", verbosity=options.get("verbosity", 1))
        self.stdout.write(self.style.SUCCESS("Loaded initial portfolio content."))
