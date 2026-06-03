from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    category = models.ForeignKey('category.Category', on_delete=models.SET_NULL, null=True, related_name='books')
    isbn = models.CharField(max_length=13, unique=True)
    published_date = models.DateField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} by {self.author}"