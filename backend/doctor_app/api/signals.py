from django.db.models.signals import post_save, post_delete,m2m_changed
from django.dispatch import receiver
from django.core.cache import cache
from django_redis import get_redis_connection

from doctor_app.models import Doctor


def clear_doctor_cache():
    redis = get_redis_connection("default")

    keys = redis.keys("doctor:list:*")

    if keys:
        redis.delete(*keys)

@receiver(post_save,sender=Doctor)
def clear_doctor_cache_save(sender, instance, **kwargs):
    clear_doctor_cache()
    
    

@receiver(post_delete,sender=Doctor)
def clear_doctor_cache_delete(sender, instance, **kwargs):
    clear_doctor_cache()


#for changing the many to many field in doctor
@receiver(m2m_changed,sender=Doctor.subExpertize_relateds.through)
def clear_doctor_m2m_subExpertize_relateds_cache(sender, **kwargs):
    
    clear_doctor_cache()
    
@receiver(m2m_changed,sender=Doctor.providers_recommended.through)
def clear_doctor_m2m_providers_recommended_cache(sender, **kwargs):
    
    clear_doctor_cache()