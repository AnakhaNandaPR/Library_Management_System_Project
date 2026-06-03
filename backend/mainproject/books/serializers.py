from rest_framework import serializers
from .models import Book
class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'category', 'isbn', 'published_date', 'is_available','category_name']