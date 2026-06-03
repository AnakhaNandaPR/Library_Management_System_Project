from rest_framework import serializers
from .models import Loan
class LoanSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='user.username', read_only=True)
    #book_title = serializers.CharField(source='book.title', read_only=True)
    book_details = serializers.SerializerMethodField()

    class Meta:
        model=Loan
        fields = [
            'id', 'book', 'user', 'student_username', 
            'borrowed_at', 'due_date', 'returned_at', 
            'fine_amount', 'book_details'
        ]



    def get_book_details(self, obj):
        return {
            "title": obj.book.title,
            "author": obj.book.author,
            "is_available": obj.book.is_available
        }
