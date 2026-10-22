from django.urls import path
from .views import profile_list

urlpatterns = [
    path("profile/", profile_list),
]