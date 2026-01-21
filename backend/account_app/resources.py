from import_export import resources
from .models import *


class AccountResource(resources.ModelResource):
     class Meta:
          model = Account