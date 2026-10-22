from django.contrib import admin

from .models import (
    BlogPost,
    ContactMessage,
    Education,
    Experience,
    Profile,
    Project,
    Skill,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "headline", "email", "updated_at")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "featured", "created_at")
    list_filter = ("featured",)
    search_fields = ("title", "description")


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "level")
    list_filter = ("category",)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("role", "company", "start_date", "end_date")


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("degree", "institution", "start_year", "end_year")


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "published", "created_at")
    list_filter = ("published",)
    prepopulated_fields = {"slug": ("title",)}


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "read", "created_at")
    list_filter = ("read",)
    readonly_fields = ("created_at",)