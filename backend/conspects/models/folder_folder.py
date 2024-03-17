from django.db import models
from django_extensions.db.models import TimeStampedModel

from conspects.models.folder import Folder


class FolderFolder(TimeStampedModel):
    parent = models.ForeignKey(Folder, related_name='parent_folder', on_delete=models.CASCADE)
    child = models.ForeignKey(Folder, related_name='child_folder', on_delete=models.CASCADE)
