from django.db.models.signals import post_save, post_delete,m2m_changed
from django.dispatch import receiver
from django.core.cache import cache
from django_redis import get_redis_connection


from doctor_app.models import Doctor,Center,Expertize

def clear_cache_pattern(pattern):

    redis = get_redis_connection("default")

    keys = redis.keys(pattern)


    if keys:
        redis.delete(*keys)



########doctor signals ###############
@receiver(post_save,sender=Doctor)
def clear_doctor_cache_save(sender, instance, **kwargs):
    clear_cache_pattern("doctor:*")

    
    

@receiver(post_delete,sender=Doctor)
def clear_doctor_cache_delete(sender, instance, **kwargs):

    clear_cache_pattern("doctor:*")



#for changing the many to many field in doctor
@receiver(m2m_changed,sender=Doctor.subExpertize_relateds.through)
def clear_doctor_m2m_subExpertize_relateds_cache(sender, **kwargs):
    

    clear_cache_pattern("doctor:*")

    
@receiver(m2m_changed,sender=Doctor.providers_recommended.through)
def clear_doctor_m2m_providers_recommended_cache(sender, **kwargs):
    

    clear_cache_pattern("doctor:*")
    
########    center signals   ###############   
@receiver(post_save,sender=Center)
def clear_center_cache_save(sender, instance, **kwargs):
    clear_cache_pattern("center:*")
    
@receiver(post_delete,sender=Center)
def clear_center_cache_delete(sender, instance, **kwargs):
    clear_cache_pattern("center:*")


####### expertize signals #############
@receiver(post_save,sender=Expertize)
def clear_expertize_cache_save(sender, instance, **kwargs):
    clear_cache_pattern("expertize:*")

@receiver(post_delete,sender=Expertize)
def clear_expertize_cache_delete(sender, instance, **kwargs):
    clear_cache_pattern("expertize:*")