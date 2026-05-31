
from rest_framework import generics, viewsets

from rest_framework import status
from rest_framework.decorators import action


from book_app.api.serializers import AppointmentSerializer
from book_app.models import Appointment
from book_app.tasks import send_booked_email

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related('provider_related','patient')
    serializer_class = AppointmentSerializer
    pagination_class=None
    my_tags = ["Book"]
    
    def perform_create(self, serializer):
        instance=serializer.save()
        if instance:
            send_booked_email(instance.patient.email)
    
