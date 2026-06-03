from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
   
    
    @action(detail=False, methods=['get'], url_path='by_category/(?P<category_id>[^/.]+)')
    def by_category(self, request, category_id=None):
        books = Book.objects.filter(category_id=category_id)
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)