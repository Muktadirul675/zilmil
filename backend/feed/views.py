# feed/models.py
# feed/views.py

from rest_framework import viewsets
from .models import FeedSection
from .serializers import FeedSectionSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class FeedSectionViewSet(viewsets.ModelViewSet):
    queryset = FeedSection.objects.filter(is_active=True)
    serializer_class = FeedSectionSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    @action(detail=False, methods=['post'])
    def build(self, request):
        data = request.data  # This should be a list of sections
        if not isinstance(data, list):
            return Response({"success": False, "message": "Expected a list of sections"}, status=status.HTTP_400_BAD_REQUEST)

        # Delete all existing
        FeedSection.objects.all().delete()

        created_sections = []
        for index, section_data in enumerate(data):
            section_data['position'] = index + 1
            serializer = self.get_serializer(data=section_data)
            if serializer.is_valid():
                serializer.save()
                created_sections.append(serializer.data)
            else:
                return Response({
                    "success": False,
                    "message": f"Invalid data in section at index {index}",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Feed sections built successfully",
            "data": created_sections
        }, status=status.HTTP_201_CREATED)