from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_acceptance_email(user_email, is_accepted):
    if is_accepted:
        subject = "قبولی"
        message = "شما با موفقیت قبول شده‌اید."
    else:
        subject = "عدم قبولی"
        message = "متأسفانه قبول نشده‌اید."

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False
    )
