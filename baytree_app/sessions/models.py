from django.db import models


class Activity(models.Model):
    # MENTORING_ACTIVITIES = (
    #     ("Youth mentoring", "Youth mentoring"),
    #     ("Women's support", "Women's support"),
    #     ("Into School mentoring", "Into School mentoring"),
    # )

    name = models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.name


# Create your models here.
