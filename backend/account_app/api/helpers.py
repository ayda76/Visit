from django.core.cache import cache
from django_redis import get_redis_connection

MAX_ATTEMPTS = 5
#15 min
LOCK_TIME = 900

def is_locked(username):

    attempts = cache.get(
        f"login_attempts:{username}",
        0
    )

    return attempts >= MAX_ATTEMPTS



# def register_failed_attempt(username):

#     key = f"login_attempts:{username}"

#     attempts = cache.get(key, 0)

#     cache.set(
#         key,
#         attempts + 1,
#         timeout=LOCK_TIME
#     )
    


   
def clear_attempts(username):

    cache.delete(
        f"login_attempts:{username}"
    )
    
    
def is_locked(username):

    redis = get_redis_connection("default")

    key = f"login_attempts:{username}"

    attempts = redis.get(key)

    if attempts is None:
        return False

    return int(attempts) >= MAX_ATTEMPTS


def register_failed_attempt(username):

    redis = get_redis_connection("default")

    key = f"login_attempts:{username}"

    attempts = redis.incr(key)
    if attempts == 1:
        redis.expire(key, LOCK_TIME)

    return attempts

def clear_attempts(username):

    redis = get_redis_connection("default")

    redis.delete(
        f"login_attempts:{username}"
    )