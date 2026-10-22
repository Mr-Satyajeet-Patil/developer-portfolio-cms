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


class Project(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    technologies = models.CharField(max_length=300, blank=True)
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True)
    level = models.PositiveIntegerField(default=70)

    def __str__(self):
        return self.name


class Experience(models.Model):
    company = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    current = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.role} - {self.company}"


class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField()
    content = models.TextField()
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject}"