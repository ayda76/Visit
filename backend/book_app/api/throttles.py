from rest_framework.throttling import UserRateThrottle


class AppointmentThrottle(UserRateThrottle):
    scope = "appointment"