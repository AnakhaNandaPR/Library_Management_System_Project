from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
# Create your models here.
def default_due_date():
    return timezone.now().date() + timedelta(days=15)
class Loan(models.Model):
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='loans')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loans')
    borrowed_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(default=default_due_date)
    returned_at = models.DateTimeField(blank=True, null=True)
    fine_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username} borrowed {self.book.title}"