from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MonthlyReportSerializer
from .models import MonthlyReport

# Create your views here.
class MonthlyReportViews(APIView):
    def post(self, request):
        serializer = MonthlyReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            item = MonthlyReport.objects.get(id=id)
            serializer = MonthlyReportSerializer(item)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        items = MonthlyReport.objects.all()
        serializer = MonthlyReportSerializer(items, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

