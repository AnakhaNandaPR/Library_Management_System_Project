from rest_framework.routers import DefaultRouter
from .views import LoanViewSet
router=DefaultRouter()
router.register('loan',LoanViewSet)
urlpatterns = router.urls