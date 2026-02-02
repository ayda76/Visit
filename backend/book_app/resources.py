from import_export import resources
from .models import *


class AppointmentResource(resources.ModelResource):
     class Meta:
          model = Appointment