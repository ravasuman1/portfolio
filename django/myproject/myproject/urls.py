"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapp.views import UserLoginView,UserRegistrationView,UserLogoutView,CategoryViewSet,BookListView,CartViewSet,OrderViewSet
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login',UserLoginView.as_view() ),
    path('api/register',UserRegistrationView.as_view() ),
    path('api/logout',UserLogoutView.as_view() ),
    path('api/category',CategoryViewSet.as_view({'get':'list'}) ),
    path('api/book',BookListView.as_view() ),
    path('api/cart',CartViewSet.as_view({'get':'list','post':'create'
                                          }) ),
    path('api/cart/<int:pk>',CartViewSet.as_view({'put':'update'
                                          }) ),
    path('api/order',OrderViewSet.as_view({'post':'create','get':'list'}))


    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
