from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MonthlyReport
from .serializers import MonthlyReportSerializer
from .permissions import *


class MonthlyReportView(APIView):
    permission_classes = [IsOwner]

    def get(self, request, id=None):
        if id:
            try:
                queryset = MonthlyReport.objects.get(id=id)
            except MonthlyReport.DoesNotExist:
                return Response({'errors': 'This report does not exist.'}, status=400)
            read_serializer = MonthlyReportSerializer(queryset)
        else:
            queryset = MonthlyReport.objects.all()
            read_serializer = MonthlyReportSerializer(queryset, many=True)
        return Response(read_serializer.data)

    def post(self, request):
        create_serializer = MonthlyReportSerializer(data=request.data)
        if create_serializer.is_valid():
            report_object = create_serializer.save()
            read_serializer = MonthlyReportSerializer(report_object)
            return Response(read_serializer.data, status=201)
        return Response(create_serializer.errors, status=400)

    def put(self, request, id=None):
        try:
            report = MonthlyReport.objects.get(id=id)
        except MonthlyReport.DoesNotExist:
            return Response({'errors': 'This report does not exist.'}, status=400)
        update_serializer = MonthlyReportSerializer(report, data=request.data)

        if update_serializer.is_valid():
            report_object = update_serializer.save()
            read_serializer = MonthlyReportSerializer(report_object)
            return Response(read_serializer.data, status=200)
        return Response(update_serializer.errors, status=400)

    def delete(self, request, id=None):
        try:
            report = MonthlyReport.objects.get(id=id)
        except MonthlyReport.DoesNotExist:
            return Response({'errors': 'This report does not exist.'}, status=400)

        report.delete()

        return Response(status=204)