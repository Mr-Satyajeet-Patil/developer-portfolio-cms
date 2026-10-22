from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    BlogPost,
    ContactMessage,
    Education,
    Experience,
    Profile,
    Project,
    Skill,
)
from .serializers import (
    BlogPostSerializer,
    ContactMessageSerializer,
    EducationSerializer,
    ExperienceSerializer,
    ProfileSerializer,
    ProjectSerializer,
    SkillSerializer,
)


@api_view(["GET"])
def profile_list(request):
    profiles = Profile.objects.all()
    return Response(ProfileSerializer(profiles, many=True).data)


@api_view(["GET"])
def project_list(request):
    projects = Project.objects.all()
    return Response(ProjectSerializer(projects, many=True).data)


@api_view(["GET"])
def skill_list(request):
    skills = Skill.objects.all()
    return Response(SkillSerializer(skills, many=True).data)


@api_view(["GET"])
def experience_list(request):
    experiences = Experience.objects.all()
    return Response(ExperienceSerializer(experiences, many=True).data)


@api_view(["GET"])
def education_list(request):
    education = Education.objects.all()
    return Response(EducationSerializer(education, many=True).data)


@api_view(["GET"])
def blog_list(request):
    posts = BlogPost.objects.filter(published=True)
    return Response(BlogPostSerializer(posts, many=True).data)


@api_view(["POST"])
def contact_create(request):
    serializer = ContactMessageSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Message sent successfully."},
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )