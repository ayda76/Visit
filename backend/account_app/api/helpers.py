from django.core.cache import cache


MAX_ATTEMPTS = 5
#15 min
LOCK_TIME = 900

def is_locked(username):

    attempts = cache.get(
        f"login_attempts:{username}",
        0
    )

    return attempts >= MAX_ATTEMPTS



def register_failed_attempt(username):

    key = f"login_attempts:{username}"

    attempts = cache.get(key, 0)

    cache.set(
        key,
        attempts + 1,
        timeout=LOCK_TIME
    )
    
    
def clear_attempts(username):

    cache.delete(
        f"login_attempts:{username}"
    )