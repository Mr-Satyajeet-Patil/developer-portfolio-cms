from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Profile
from .serializers import ProfileSerializer


@api_view(["GET"])
def profile_list(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)