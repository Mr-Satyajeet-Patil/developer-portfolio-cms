from django.db import models


class Profile(models.Model):
    name = models.CharField(max_length=100)
    headline = models.CharField(max_length=200)
    bio = models.TextField()
    email = models.EmailField()
    location = models.CharField(max_length=100, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    profile_image = models.ImageField(
        upload_to="profile/",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name