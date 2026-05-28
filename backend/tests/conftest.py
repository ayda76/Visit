import pytest
from django.contrib.auth.models import User

from pytest_factoryboy import register



register(UserFactory)

register(ProfileFactory)
register(PostFactory)

register(CommentFactory)