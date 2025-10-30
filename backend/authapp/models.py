# models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class ActivePage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    path = models.CharField(max_length=255)
    last_seen = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} @ {self.path}"