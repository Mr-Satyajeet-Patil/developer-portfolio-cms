"""URL configuration for the portfolio project."""

from pathlib import Path

from django.conf import settings
from django.contrib import admin
from django.http import FileResponse, HttpResponse
from django.urls import include, path, re_path
from django.views.static import serve as serve_media

FRONTEND_INDEX = Path(settings.FRONTEND_DIST) / "index.html"


def frontend_index(request):
    """Serve the built React app (production and local smoke tests)."""
    if not FRONTEND_INDEX.exists():
        return HttpResponse(
            "The frontend has not been built. Run `npm run build` in frontend/.",
            status=503,
            content_type="text/plain",
        )
    return FileResponse(FRONTEND_INDEX.open("rb"), content_type="text/html")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("portfolio.urls")),
    # Uploaded files. The portfolio is low-traffic, so Django can serve media
    # itself; for a bigger site use object storage instead.
    re_path(r"^media/(?P<path>.*)$", serve_media, {"document_root": settings.MEDIA_ROOT}),
    # Everything else is the single-page React app. API, admin, media and static
    # URLs are excluded so unknown API routes still return a real 404.
    re_path(r"^(?!api/|admin/|media/|static/).*$", frontend_index),
]
