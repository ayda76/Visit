from import_export import resources
from .models import Appointment


class AppointmentResource(resources.ModelResource):
     class Meta:
          model = Appointment