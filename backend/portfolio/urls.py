from django.urls import path

from .views import (
    blog_list,
    contact_create,
    education_list,
    experience_list,
    profile_list,
    project_list,
    skill_list,
)

urlpatterns = [
    path("profile/", profile_list),
    path("projects/", project_list),
    path("skills/", skill_list),
    path("experience/", experience_list),
    path("education/", education_list),
    path("blog/", blog_list),
    path("contact/", contact_create),
]