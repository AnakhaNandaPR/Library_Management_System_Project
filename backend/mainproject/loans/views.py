from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from decimal import Decimal
from .models import Loan
from books.models import Book
from .serializers import LoanSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

    def create(self, request, *args, **kwargs):
        book_id = request.data.get('book_id')
        try:
            book = Book.objects.get(id=book_id)
            if not book.is_available:
                return Response({"detail": "This book asset is currently checked out."}, status=status.HTTP_400_BAD_REQUEST)
            
            
            loan = Loan.objects.create(
                user=request.user, 
                book=book
            )
            
            book.is_available = False
            book.save()
            
            serializer = self.get_serializer(loan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Book.DoesNotExist:
            return Response({"detail": "Book profile not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def my_loans(self, request):
        loans = Loan.objects.filter(user=request.user)
        serializer = self.get_serializer(loans, many=True)
        return Response(serializer.data)

    
    @action(detail=True, methods=['put'])
    def request_return(self, request, pk=None):
        try:
            loan = self.get_object()
            if loan.returned_at is not None:
                return Response({"detail": "This return request or ledger transaction is already active or settled."}, status=status.HTTP_400_BAD_REQUEST)
            
            
            loan.returned_at = timezone.now()
            today_date = loan.returned_at.date()
            
            if today_date > loan.due_date:
                days_overdue = (today_date - loan.due_date).days
                fine_rate = Decimal('2.00')  
                loan.fine_amount = days_overdue * fine_rate
            else:
                loan.fine_amount = Decimal('0.00') 

           
            if hasattr(loan, 'status'):
                loan.status = "Pending Return"

            loan.save()

           
            return Response({"message": "Return request recorded. Fines evaluated. Please hand the physical asset to the librarian."})
        except Loan.DoesNotExist:
            return Response({"detail": "Circulation log reference not found."}, status=status.HTTP_404_NOT_FOUND)

   
    @action(detail=True, methods=['post'])
    def confirm_return(self, request, pk=None):
        try:
            loan = self.get_object()

           
            if not request.user.is_staff:
                return Response({"detail": "Access Denied: Only Librarians can receive returned items."}, status=status.HTTP_403_FORBIDDEN)

            if loan.returned_at is None:
                return Response({"detail": "The student has not initiated a return request for this asset yet."}, status=status.HTTP_400_BAD_REQUEST)

            
            if hasattr(loan, 'status'):
                loan.status = "Closed"

            
            book = loan.book
            book.is_available = True
            book.save()
            loan.save()

            return Response({"message": "Librarian verification successful. Book restored to catalog inventory values."})
        except Loan.DoesNotExist:
            return Response({"detail": "Circulation log reference not found."}, status=status.HTTP_404_NOT_FOUND)


        
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class LibraryTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff  
        
        return data

class LibraryTokenObtainPairView(TokenObtainPairView):
    serializer_class = LibraryTokenObtainPairSerializer